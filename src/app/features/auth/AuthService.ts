import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@app/core/models/User.model';
import { MySQLAuthRepository } from './MySQLAuthRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export class AuthService {
  private _authRepository: MySQLAuthRepository;

  constructor() {
    this._authRepository = new MySQLAuthRepository();
  }

  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this._authRepository.createUser(name, email, hashedPassword, role);
  }

  async loginUser(user: User) {
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
