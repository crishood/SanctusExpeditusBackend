import { IOrderRepository } from '@app/core/interfaces/OrderRepository';
import { Order, OrderStatus } from '@app/core/models/Order.model';
import pool from '@config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class MySQLOrderRepository implements IOrderRepository {
  async getOrders(): Promise<Order[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders');
    return rows as Order[];
  }

  async getOrderById(id: string): Promise<Order | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Order) : null;
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO orders (user_id, weight, length, width, height, product_type, destination_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        order.user_id,
        order.weight,
        order.length,
        order.width,
        order.height,
        order.product_type,
        order.destination_address,
      ]
    );
    return { ...order, id: result.insertId.toString() } as Order;
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0 ? ({ id, status } as Order) : null;
  }

  async updateOrderRoute(id: string, route_id: string): Promise<Order | null> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE orders SET route_id = ? WHERE id = ?',
      [route_id, id]
    );
    return result.affectedRows > 0 ? ({ id, route_id } as Order) : null;
  }
}
