// ========================================
// src/utils/jwt.util.ts
// ========================================
import jwt, { SignOptions } from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  role: "user" | "trainer";
  email?: string;
}

export const generateToken = (
  payload: JWTPayload,
  expiresIn: string = "7d"
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  // Solution 1: Type assertion (recommended for this case)
  const options: SignOptions = { expiresIn } as SignOptions;
  return jwt.sign(payload, secret, options);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const options: SignOptions = { expiresIn: "30d" } as SignOptions;
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};
