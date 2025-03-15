import { RequestHandler } from 'express';
import { AuthService } from './AuthService';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';

export class AuthController {
  constructor(private _authService: AuthService) {}

  public register: RequestHandler = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      await this._authService.registerUser(name, email, password, role);
      res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED });
    } catch (error) {
      res.status(400).json({ error: ERROR_MESSAGES.BAD_REQUEST });
    }
  };

  public login: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: ERROR_MESSAGES.MISSING_CREDENTIALS,
        });
        return;
      }

      const data = await this._authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_LOGGED_IN,
        data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 401;
      const errorMessage = error.message || ERROR_MESSAGES.UNAUTHORIZED;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }
  };
}
