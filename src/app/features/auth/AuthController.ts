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
      HttpResponse.success(res, SUCCESS_MESSAGES.USER_REGISTERED, 201);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
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

      HttpResponse.successWithData(
        res,
        SUCCESS_MESSAGES.USER_LOGGED_IN,
        data,
        200
      );
    } catch (error: any) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };
}
