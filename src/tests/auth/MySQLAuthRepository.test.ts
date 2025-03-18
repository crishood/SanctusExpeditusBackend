import pool from '@config/mySql';
import { MySQLAuthRepository } from '@app/features/auth/MySQLAuthRepository';
import { RowDataPacket } from 'mysql2';

jest.mock('@config/mySql', () => ({
  query: jest.fn(),
}));

describe('MySQLAuthRepository', () => {
  let authRepository: MySQLAuthRepository;

  beforeEach(() => {
    authRepository = new MySQLAuthRepository();
    jest.clearAllMocks();
  });

  test('findUserByEmail() should return a user if it exists in the DB', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashedPass',
      role: 'customer',
    };
    (pool.query as jest.Mock).mockResolvedValue([
      [mockUser] as RowDataPacket[],
      [],
    ]);

    const result = await authRepository.findUserByEmail('john@example.com');

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = ?',
      ['john@example.com']
    );
    expect(result).toEqual(mockUser);
  });

  test('findUserByEmail() should return null if the user does not exist', async () => {
    (pool.query as jest.Mock).mockResolvedValue([[], []]);

    const result = await authRepository.findUserByEmail('notfound@example.com');

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = ?',
      ['notfound@example.com']
    );
    expect(result).toBeNull();
  });

  test('createUser() should insert a user in the DB', async () => {
    (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

    await authRepository.createUser(
      'Jane Doe',
      'jane@example.com',
      'hashedPass',
      'admin'
    );

    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, ?)',
      ['Jane Doe', 'jane@example.com', 'hashedPass', 'admin']
    );
  });
});
