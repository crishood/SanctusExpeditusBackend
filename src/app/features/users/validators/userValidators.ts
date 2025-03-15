import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { Request, Response, NextFunction } from 'express';

export class UserValidators {
  static validateUpdateUserInput(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const updatedFields = req.body;
    const forbiddenFields = ['id', 'created_at', 'role', 'password'];
    const invalidFields = Object.keys(updatedFields).filter((field) =>
      forbiddenFields.includes(field)
    );

    if (invalidFields.length > 0 || Object.keys(updatedFields).length === 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_USER_INPUT,
        statusCode: 400,
      });
      return;
    }

    next();
  }
}
