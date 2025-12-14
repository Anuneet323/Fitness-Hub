// JWT utility functions
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
  if (!secret) throw new Error("JWT_SECRET missing");

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  return jwt.sign(payload, secret, { expiresIn: "30d" } as SignOptions);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
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
