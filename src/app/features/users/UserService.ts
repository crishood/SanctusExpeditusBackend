import { User } from '@app/core/models/User.model';
import { MySQLUserRepository } from './MySQLUserRepository';

export class UserService {
  private _userRepository: MySQLUserRepository;

  constructor() {
    this._userRepository = new MySQLUserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return await this._userRepository.getUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this._userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this._userRepository.getUserByEmail(email);
  }

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    await this._userRepository.updateUser(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    await this._userRepository.deleteUser(id);
  }
}
