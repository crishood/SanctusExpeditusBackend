import { User } from '@app/core/models/User.model';
import { MySQLUserRepository } from './MySQLUserRepository';

export class UserService {
  private userRepository: MySQLUserRepository;

  constructor() {
    this.userRepository = new MySQLUserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    await this.userRepository.updateUser(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
