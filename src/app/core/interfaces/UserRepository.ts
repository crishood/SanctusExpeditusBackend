import { User } from '@app/core/models/User.model';

export interface IUserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'created_at'>>
  ): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
