import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { UserRole } from '@app/core/models/User.model';
import { FORM_CONSTANTS } from '@app/core/constants/forms';
import { IAuthRepository } from '@app/core/interfaces/AuthRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export class AuthService {
  constructor(private _authRepository: IAuthRepository) {}

  private validateUserInput(name: string, email: string, password: string) {
    if (!FORM_CONSTANTS.REGEX.PASSWORD.test(password)) {
      throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    }
    if (!FORM_CONSTANTS.REGEX.EMAIL.test(email)) {
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    }
    if (!FORM_CONSTANTS.REGEX.LETTERS.test(name)) {
      throw new Error(ERROR_MESSAGES.INVALID_NAME);
    }
  }

  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) {
    this.validateUserInput(name, email, password);

    const existingUser = await this._authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this._authRepository.createUser(name, email, hashedPassword, role);
  }

  async loginUser(email: string, password: string) {
    const user = await this._authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
