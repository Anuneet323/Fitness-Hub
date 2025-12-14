// API response helpers
import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  meta?: ApiResponse["meta"]
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string,
  errors?: any[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  return successResponse(res, message, data, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};
