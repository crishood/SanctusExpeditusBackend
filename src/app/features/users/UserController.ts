import { RequestHandler, Request, Response } from 'express';
import { UserService } from './UserService';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';
import { HttpResponse } from '@app/core/middleware/errorHandler/HttpResponse';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export class UserController {
  constructor(private _userService: UserService) {}

  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
      const users = await this._userService.getAllUsers();
      res.json(users);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
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
      res.json(user);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
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
      res.json(user);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedFields = req.body;
      const forbiddenFields = ['id', 'created_at', 'role', 'password'];
      const invalidFields = Object.keys(updatedFields).filter((field) =>
        forbiddenFields.includes(field)
      );

      if (invalidFields.length > 0 || Object.keys(updatedFields).length === 0) {
        throw new Error(ERROR_MESSAGES.INVALID_USER_INPUT);
      }

      await this._userService.updateUser(id, updatedFields);
      res.json({ message: SUCCESS_MESSAGES.USER_UPDATED });
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  };

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this._userService.deleteUser(id);
      res.json({ message: SUCCESS_MESSAGES.USER_DELETED });
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  };
}
