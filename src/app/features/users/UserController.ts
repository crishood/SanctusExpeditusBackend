import { RequestHandler, Request, Response } from 'express';
import { UserService } from './UserService';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';
import { HttpResponse } from '@app/utils/HttpResponse';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export class UserController {
  constructor(private _userService: UserService) {}

  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
      const users = await this._userService.getAllUsers();
      HttpResponse.successWithData(res, null, users, 200);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };

  public getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this._userService.getUserById(id);
      if (!user) {
        HttpResponse.error(res, ERROR_MESSAGES.USER_NOT_FOUND, 404);
        return;
      }
      HttpResponse.successWithData(res, null, user, 200);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };

  public getUserByEmail: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { email } = req.body;
      const user = await this._userService.getUserByEmail(email);
      if (!user) {
        HttpResponse.error(res, ERROR_MESSAGES.USER_NOT_FOUND, 404);
        return;
      }
      HttpResponse.successWithData(res, null, user, 200);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      HttpResponse.success(res, SUCCESS_MESSAGES.USER_UPDATED, 200);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this._userService.deleteUser(id);
      HttpResponse.success(res, SUCCESS_MESSAGES.USER_DELETED, 200);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };
}
