import { RequestHandler } from 'express';
import { AuthService } from './AuthService';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';
import { AuthenticatedRequest } from '@app/core/models/Req.model';
import { HttpResponse } from '@app/utils/HttpResponse';

export class AuthController {
  constructor(private _authService: AuthService) {}

  public register: RequestHandler = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      await this._authService.registerUser(name, email, password, role);
      res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public login: RequestHandler = async (req: AuthenticatedRequest, res) => {
    try {
      const { user } = req;

      if (!user) {
        HttpResponse.error(res, ERROR_MESSAGES.UNAUTHORIZED, 401);
        return;
      }

      const data = await this._authService.loginUser(user);

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
