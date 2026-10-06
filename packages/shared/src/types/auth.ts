import { UserRole } from '../constants/roles.constants';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  isActive: boolean;
  warehouseId?: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserDto;
  tokens: AuthTokens;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  warehouseId?: string | null;
}
