import { Request, Response } from 'express';
import { getAllUsers } from './UserService';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
