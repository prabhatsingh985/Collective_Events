export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  error?: ApiErrorPayload;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: any;
}
