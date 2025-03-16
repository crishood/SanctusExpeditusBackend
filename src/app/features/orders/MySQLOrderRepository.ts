import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { IOrderRepository } from '@app/core/interfaces/OrderRepository';
import {
  Order,
  OrderStatus,
  OrderStatusHistory,
} from '@app/core/models/Order.model';
import { Route, RouteStop } from '@app/core/models/Route.model';
import { Transporter } from '@app/core/models/Transporter.model';
import pool from '@config/database';
import redis from '@config/redisClient';
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

  async getOrderStatusHistory(id: string): Promise<OrderStatusHistory[]> {
    const cacheKey = `order_status:${id}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM order_status_history WHERE order_id = ?',
      [id]
    );

    await redis.setex(cacheKey, 60, JSON.stringify(rows));

    return rows as OrderStatusHistory[];
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO orders (user_id, weight, length, width, height, product_type, delivery_city, destination_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        order.user_id,
        order.weight,
        order.length,
        order.width,
        order.height,
        order.product_type,
        order.delivery_city,
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

  async validateOrderAndRoute(
    id: string,
    route_id: string
  ): Promise<{ success: boolean; error?: string }> {
    const [orderResult] = await pool.query<RowDataPacket[]>(
      'SELECT delivery_city, weight, width, height, length, route_id FROM orders WHERE id = ?',
      [id]
    );
    if (!Array.isArray(orderResult) || orderResult.length === 0) {
      return { success: false, error: ERROR_MESSAGES.ORDER_NOT_FOUND };
    }
    const {
      delivery_city,
      weight,
      width,
      height,
      length,
      route_id: existingRouteId,
    } = orderResult[0] as Order;

    if (existingRouteId === route_id) {
      return { success: false, error: ERROR_MESSAGES.ORDER_ALREADY_HAS_ROUTE };
    }

    const [routeResult] = await pool.query(
      'SELECT id, transporter_id, destination FROM routes WHERE id = ?',
      [route_id]
    );
    if (!Array.isArray(routeResult) || routeResult.length === 0) {
      return { success: false, error: ERROR_MESSAGES.ROUTE_NOT_FOUND };
    }
    const { transporter_id, destination } = routeResult[0] as Route;

    const [stopsResult] = await pool.query(
      'SELECT city FROM route_stops WHERE route_id = ? AND city = ?',
      [route_id, delivery_city]
    );
    const isValidCity =
      (stopsResult as RouteStop[]).length > 0 || delivery_city === destination;
    if (!isValidCity) {
      return { success: false, error: ERROR_MESSAGES.INVALID_DELIVERY_CITY };
    }

    const [capacityResult] = await pool.query<RowDataPacket[]>(
      'SELECT max_weight, max_volume FROM transporters WHERE user_id = ?',
      [transporter_id]
    );
    const { max_weight = 0, max_volume = 0 } =
      capacityResult[0] as Partial<Transporter>;

    const volume = width * height * length;

    if (weight > max_weight || volume > max_volume) {
      return { success: false, error: ERROR_MESSAGES.INSUFFICIENT_CAPACITY };
    }

    return { success: true };
  }

  async updateOrderRoute(id: string, route_id: string): Promise<Order | null> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE orders SET route_id = ? WHERE id = ?',
      [route_id, id]
    );
    return result.affectedRows > 0 ? ({ id, route_id } as Order) : null;
  }

  async updateTransporterCapacity(
    route_id: string,
    order_id: string
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `
      UPDATE transporters 
      SET 
        max_weight = max_weight - (SELECT weight FROM orders WHERE id = ?),
        max_volume = max_volume - (SELECT width * height * length FROM orders WHERE id = ?)
      WHERE user_id = (SELECT transporter_id FROM routes WHERE id = ?)
      AND max_weight >= (SELECT weight FROM orders WHERE id = ?)
      AND max_volume >= (SELECT width * height * length FROM orders WHERE id = ?);
      `,
      [order_id, order_id, route_id, order_id, order_id]
    );

    return result.affectedRows > 0;
  }
}
