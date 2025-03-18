import pool from '@config/mySql';
import { MySQLUserRepository } from '@app/features/users/MySQLUserRepository';
import { RowDataPacket } from 'mysql2';
import { User, UserRole } from '@app/core/models/User.model';

jest.mock('@config/mySql', () => ({
  query: jest.fn(),
}));

describe('MySQLUserRepository', () => {
  let userRepository: MySQLUserRepository;
  const mockUser: User = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.CUSTOMER,
    created_at: new Date('2023-01-01T00:00:00.000Z'),
    password_hash: 'hashedpassword123',
  };

  beforeEach(() => {
    userRepository = new MySQLUserRepository();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    test('should return all users', async () => {
      const mockUsers = [
        mockUser,
        { ...mockUser, id: '456', email: 'jane@example.com', name: 'Jane Doe' },
      ];
      (pool.query as jest.Mock).mockResolvedValue([
        mockUsers as RowDataPacket[],
        [],
      ]);

      const result = await userRepository.getUsers();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users'
      );
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    test('should return a user when found', async () => {
      (pool.query as jest.Mock).mockResolvedValue([
        [mockUser] as RowDataPacket[],
        [],
      ]);

      const result = await userRepository.getUserById('123');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        ['123']
      );
      expect(result).toEqual(mockUser);
    });

    test('should return null when user not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue([[], []]);

      const result = await userRepository.getUserById('999');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        ['999']
      );
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    test('should return a user when found', async () => {
      (pool.query as jest.Mock).mockResolvedValue([
        [mockUser] as RowDataPacket[],
        [],
      ]);

      const result = await userRepository.getUserByEmail('john@example.com');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users WHERE email = ?',
        ['john@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    test('should return null when user not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue([[], []]);

      const result = await userRepository.getUserByEmail(
        'notfound@example.com'
      );

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users WHERE email = ?',
        ['notfound@example.com']
      );
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    test('should update user with provided fields', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };
      (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

      await userRepository.updateUser('123', updateData);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        ['John Updated', 'john.updated@example.com', '123']
      );
    });

    test('should do nothing when no fields to update', async () => {
      await userRepository.updateUser('123', {});

      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    test('should delete user with the given id', async () => {
      (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

      await userRepository.deleteUser('123');

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = ?',
        ['123']
      );
    });
  });
});
