import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { FormFieldValidator } from '@app/utils/FormFieldValidator';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { MySQLAuthRepository } from '../../../features/auth/MySQLAuthRepository';
import { AuthenticatedRequest } from '@app/core/models/Req.model';

export class AuthValidators {
  private _authRepository: MySQLAuthRepository;

  constructor(authRepository: MySQLAuthRepository) {
    this._authRepository = authRepository;
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
        statusCode: 400,
      });
      return;
    }

    const validationChecks = {
      name: FormFieldValidator.validateName(name),
      email: FormFieldValidator.validateEmail(email),
      password: FormFieldValidator.validatePassword(password),
      role: FormFieldValidator.validateRole(role),
    };

    const validationErrors = Object.entries(validationChecks)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_USER_INPUT,
        statusCode: 400,
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
        statusCode: 400,
      });
      return;
    }

    const validationChecks = {
      email: FormFieldValidator.validateEmail(email),
      password: FormFieldValidator.validatePassword(password),
    };

    const validationErrors = Object.entries(validationChecks)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_USER_INPUT,
        statusCode: 400,
      });
    }
    next();
  }

  async validateNewUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;

    const existingUser = await this._authRepository.findUserByEmail(email);

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
        statusCode: 409,
      });
      return;
    }

    next();
  }

  async validateCredentials(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    const user = await this._authRepository.findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        error: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD,
        statusCode: 401,
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({
        error: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD,
        statusCode: 401,
      });
      return;
    }

    req.user = user;
    next();
  }
}
