import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { UserRole } from '@app/core/models/User.model';
import { MySQLAuthRepository } from './MySQLAuthRepository';
import { UserValidator } from './validators/newUserValidator';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export class AuthService {
  private _authRepository: MySQLAuthRepository;
  private _validator: UserValidator;

  constructor() {
    this._authRepository = new MySQLAuthRepository();
    this._validator = new UserValidator(this._authRepository);
  }

  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) {
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
