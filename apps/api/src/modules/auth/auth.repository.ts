import { prisma } from '../../config/db';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { warehouse: true },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { warehouse: true },
    });
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}

export const authRepository = new AuthRepository();
