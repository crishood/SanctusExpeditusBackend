import pool from '@config/database';
import { User } from '@app/core/models/User.model';
import { IAuthRepository } from '@app/core/interfaces/AuthRepository';
import { RowDataPacket } from 'mysql2';
export class MySQLAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
    role: string
  ): Promise<void> {
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
  }
}
