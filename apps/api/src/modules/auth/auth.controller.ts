import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../core/ApiResponse';

export class AuthController {
  async login(req: Request, res: Response) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(req.body, ipAddress, userAgent);
    return ApiResponse.success(res, result, 'Login successful');
  }

  async refreshToken(req: Request, res: Response) {
    const result = await authService.refreshToken(req.body);
    return ApiResponse.success(res, result, 'Token refreshed successfully');
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken, req.user?.id);
    return ApiResponse.success(res, { loggedOut: true }, 'Logged out successfully');
  }

  async getMe(req: Request, res: Response) {
    const user = await authService.getMe(req.user!.id);
    return ApiResponse.success(res, user, 'User profile fetched');
  }
}

export const authController = new AuthController();
