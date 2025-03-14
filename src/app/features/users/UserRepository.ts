import { User } from '@app/core/models/User.model';
import pool from '@config/database';
import { RowDataPacket } from 'mysql2';

export const getUsersFromDB = async (): Promise<User[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, email, role, created_at FROM users'
  );
  return rows as User[];
};
