import { Request, Response, NextFunction } from 'express';
import { validations } from '@app/utils/validations';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { UserValidator } from './newUserValidator';
import { MySQLAuthRepository } from '../MySQLAuthRepository';
export class AuthValidators {
  private _validator: UserValidator;

  constructor() {
    this._validator = new UserValidator(new MySQLAuthRepository());
  }

  static validateRegisterInput(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { name, email, password, role } = req.body;

    const requiredFields = { name, email, password, role };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.MISSING_CREDENTIALS,
      });
      return;
    }

    const validationChecks = {
      name: validations.name(name),
      email: validations.email(email),
      password: validations.password(password),
      role: validations.role(role),
    };

    const validationErrors = Object.entries(validationChecks)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_USER_INPUT,
      });
      return;
    }

    next();
  }

  static validateLoginInput(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.MISSING_CREDENTIALS,
      });
      return;
    }

    const validationChecks = {
      email: validations.email(email),
      password: validations.password(password),
    };

    const validationErrors = Object.entries(validationChecks)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_USER_INPUT,
      });
    }
    next();
  }
}
