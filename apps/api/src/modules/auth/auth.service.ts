import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { AuthResponse, JwtPayload, LoginInput, RefreshTokenInput, UserDto, UserRole } from '@toy-wms/shared';

export class AuthService {
  private generateTokens(user: { id: string; email: string; role: string; warehouseId?: string | null }) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      warehouseId: user.warehouseId,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(
      { userId: user.id, jti: crypto.randomUUID() },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
      }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Your account has been deactivated. Please contact an admin.', 'ACCOUNT_DEACTIVATED');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user);

    // Save refresh token with 7 days expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepository.saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

    // Record audit log for login
    await auditService.log({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: { role: user.role, warehouseId: user.warehouseId },
      ipAddress,
      userAgent,
    });

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
      isActive: user.isActive,
      warehouseId: user.warehouseId,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      user: userDto,
      tokens,
    };
  }

  async refreshToken(input: RefreshTokenInput): Promise<AuthResponse> {
    let decoded: any;
    try {
      decoded = jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    const storedToken = await authRepository.findRefreshToken(input.refreshToken);
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw AppError.unauthorized('Refresh token is invalid or has been revoked', 'REVOKED_TOKEN');
    }

    const user = storedToken.user;
    if (!user || !user.isActive) {
      throw AppError.unauthorized('User account no longer active', 'INACTIVE_USER');
    }

    // Revoke old refresh token (token rotation)
    await authRepository.revokeRefreshToken(input.refreshToken);

    // Generate new token pair
    const tokens = this.generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepository.saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
      isActive: user.isActive,
      warehouseId: user.warehouseId,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      user: userDto,
      tokens,
    };
  }

  async logout(refreshToken: string, userId?: string) {
    if (refreshToken) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
    if (userId) {
      await auditService.log({
        userId,
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: userId,
      });
    }
  }

  async getMe(userId: string): Promise<UserDto> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
      isActive: user.isActive,
      warehouseId: user.warehouseId,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
