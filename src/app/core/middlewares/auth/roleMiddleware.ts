import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body.user || !roles.includes(req.body.user.role)) {
      res.status(403).json({
        error: ERROR_MESSAGES.ACCESS_DENIED,
        statusCode: 403,
      });
      return;
    }
    next();
  };
};
