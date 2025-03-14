import { User } from '@app/core/models/User.model';
import { getUsersFromDB } from './UserRepository';

export const getAllUsers = async (): Promise<User[]> => {
  return await getUsersFromDB();
};
