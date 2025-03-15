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
      res.json({
        success: true,
        data: users,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this._userService.getUserById(id);
      if (!user) {
        HttpResponse.userNotFound(res);
        return;
      }
      res.json({
        success: true,
        data: user,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public getUserByEmail: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { email } = req.params;
      const user = await this._userService.getUserByEmail(email);
      if (!user) {
        HttpResponse.userNotFound(res);
        return;
      }
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        message: SUCCESS_MESSAGES.USER_UPDATED,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this._userService.deleteUser(id);
      res.json({
        success: true,
        message: SUCCESS_MESSAGES.USER_DELETED,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };
}
