import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: ERROR_MESSAGES.ACCESS_DENIED_NO_TOKEN });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }
};
