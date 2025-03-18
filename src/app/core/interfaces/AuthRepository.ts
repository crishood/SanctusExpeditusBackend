import { User } from '../models/User.model';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(
    name: string,
    email: string,
    hashedPassword: string,
    role: string
  ): Promise<void>;
}
