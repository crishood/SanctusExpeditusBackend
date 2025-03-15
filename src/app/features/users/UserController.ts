import { RequestHandler, Request, Response } from 'express';
import { UserService } from './UserService';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';

export class UserController {
  constructor(private _userService: UserService) {}

  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
      const users = await this._userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  public getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this._userService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this._userService.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this._userService.deleteUser(id);
      res.json({ message: SUCCESS_MESSAGES.USER_DELETED });
    } catch (error) {
      res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };
}
