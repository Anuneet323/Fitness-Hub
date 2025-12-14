// ========================================
// src/middleware/auth.middleware.ts
// ========================================
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'user' | 'trainer';
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: 'user' | 'trainer';
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeTrainer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'trainer') {
    return res.status(403).json({ message: 'Access denied. Trainers only.' });
  }
  next();
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ message: 'Access denied. Users only.' });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: 'user' | 'trainer';
      };
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};