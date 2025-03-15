import { IUserRepository } from '@app/core/interfaces/UserRepository';
import { User } from '@app/core/models/User.model';
import pool from '@config/database';
import { RowDataPacket } from 'mysql2';

export class MySQLUserRepository implements IUserRepository {
  async getUsers(): Promise<User[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, created_at FROM users'
    );
    return rows as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async updateUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'created_at'>>
  ): Promise<void> {
    const fields = Object.keys(user)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(user);

    if (fields.length === 0) return;

    await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);
  }

  async deleteUser(id: string): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
}
