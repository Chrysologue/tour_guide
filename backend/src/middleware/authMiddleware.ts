import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'string' ||
      typeof decoded.email !== 'string'
    ) {
      return res.status(403).json({
        error: 'Invalid token payload'
      });
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email
    };

    next();

  } catch (err) {
    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
  }
};