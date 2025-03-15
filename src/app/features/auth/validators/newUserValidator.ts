import { MySQLAuthRepository } from '../MySQLAuthRepository';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export class UserValidator {
  constructor(private authRepository: MySQLAuthRepository) {}

  async validateNewUser(
    email: string
  ): Promise<{ error: string; statusCode: number } | void> {
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      return {
        error: ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
        statusCode: 409,
      };
    }
  }
}
