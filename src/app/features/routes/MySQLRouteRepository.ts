import { IRouteRepository } from '@app/core/interfaces/RouteRepository';
import { OrderStatus } from '@app/core/models/Order.model';
import { RouteStatus } from '@app/core/models/Route.model';
import pool from '@config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class MySQLRouteRepository implements IRouteRepository {
  async updateRouteStatus(id: string, status: RouteStatus): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        const [result] = await connection.query<ResultSetHeader>(
          `UPDATE routes SET status = ? WHERE id = ?`,
          [status, id]
        );

        if (result.affectedRows === 0) {
          await connection.rollback();
          connection.release();
          return false;
        }

        let updatedOrders: RowDataPacket[] = [];
        let orderStatus: string;

        switch (status) {
          case RouteStatus.IN_TRANSIT:
            orderStatus = OrderStatus.IN_TRANSIT;
            await connection.query(
              `UPDATE orders SET status = ? WHERE route_id = ? AND status = 'pending'`,
              [orderStatus, id]
            );
            [updatedOrders] = await connection.query<RowDataPacket[]>(
              `SELECT id FROM orders WHERE route_id = ? AND status = ?`,
              [id, orderStatus]
            );
            break;

          case RouteStatus.COMPLETED:
            orderStatus = OrderStatus.COMPLETED;
            await connection.query(
              `UPDATE orders SET status = ? WHERE route_id = ? AND status != ?`,
              [orderStatus, id, orderStatus]
            );
            [updatedOrders] = await connection.query<RowDataPacket[]>(
              `SELECT id FROM orders WHERE route_id = ? AND status = ?`,
              [id, orderStatus]
            );
            break;

          case RouteStatus.CANCELED:
            orderStatus = 'canceled';
            await connection.query(
              `UPDATE orders SET status = ? WHERE route_id = ? AND status NOT IN ('completed', 'canceled')`,
              [orderStatus, id]
            );
            [updatedOrders] = await connection.query<RowDataPacket[]>(
              `SELECT id FROM orders WHERE route_id = ? AND status = ?`,
              [id, orderStatus]
            );
            break;
        }

        if (updatedOrders && updatedOrders.length > 0) {
          const historyValues = updatedOrders
            .map((order) => `('${order.id}', '${orderStatus}')`)
            .join(',');

          await connection.query(
            `INSERT INTO order_status_history (order_id, status) VALUES ${historyValues}`
          );
        }

        await connection.commit();
        connection.release();
        return true;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error updating route status:', error);
      return false;
    }
  }

  async updateCurrentStop(id: string): Promise<boolean> {
    return true;
  }
}
