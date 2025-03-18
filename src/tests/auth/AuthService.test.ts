import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '@app/features/auth/AuthService';
import { MySQLAuthRepository } from '@app/features/auth/MySQLAuthRepository';
import { User, UserRole } from '@app/core/models/User.model';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('@app/features/auth/MySQLAuthRepository');

describe('AuthService', () => {
  let authService: AuthService;
  let authRepositoryMock: jest.Mocked<MySQLAuthRepository>;

  beforeEach(() => {
    authService = new AuthService();
    authRepositoryMock = authService[
      '_authRepository'
    ] as jest.Mocked<MySQLAuthRepository>;

    jest.clearAllMocks();
  });

  test('registerUser() should hash the password and call createUser', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    authRepositoryMock.createUser = jest.fn().mockResolvedValue(undefined);

    await authService.registerUser(
      'John Doe',
      'john@example.com',
      'Password12!',
      UserRole.CUSTOMER
    );

    expect(bcrypt.hash).toHaveBeenCalledWith('Password12!', 10);
    expect(authRepositoryMock.createUser).toHaveBeenCalledWith(
      'John Doe',
      'john@example.com',
      'hashedPassword',
      UserRole.CUSTOMER
    );
  });

  test('loginUser() should return a JWT token and user data', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashedPass',
      role: UserRole.CUSTOMER,
      created_at: new Date(),
    };

    (jwt.sign as jest.Mock).mockReturnValue('fake_jwt_token');

    const result = await authService.loginUser(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: '123', role: UserRole.CUSTOMER },
      expect.any(String),
      { expiresIn: expect.any(String) }
    );

    expect(result).toEqual({
      token: 'fake_jwt_token',
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.CUSTOMER,
      },
    });
  });
});
