import { IRouteRepository } from '@app/core/interfaces/RouteRepository';
import { OrderStatus } from '@app/core/models/Order.model';
import { RouteStatus } from '@app/core/models/Route.model';
import pool from '@config/database';
import redis from '@config/redisClient';
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

        await redis.del(`order_status:${id}`);

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
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        const [routeResult] = await connection.query<RowDataPacket[]>(
          `SELECT current_stop_order, 
                  (SELECT COUNT(*) FROM route_stops WHERE route_id = ?) AS total_stops
           FROM routes 
           WHERE id = ?`,
          [id, id]
        );

        if (!routeResult.length) {
          await connection.rollback();
          connection.release();
          return false;
        }

        const { current_stop_order, total_stops } = routeResult[0];
        const nextStopOrder = current_stop_order + 1;

        const [updateResult] = await connection.query<ResultSetHeader>(
          `UPDATE routes SET current_stop_order = ? WHERE id = ?`,
          [nextStopOrder, id]
        );

        if (updateResult.affectedRows === 0) {
          await connection.rollback();
          connection.release();
          return false;
        }

        const [ordersToComplete] = await connection.query<RowDataPacket[]>(
          `SELECT o.id 
           FROM orders o
           JOIN route_stops rs ON o.route_id = rs.route_id AND o.delivery_city = rs.city
           WHERE rs.route_id = ? AND rs.stop_order = ?`,
          [id, nextStopOrder]
        );

        if (ordersToComplete.length > 0) {
          const orderIds = ordersToComplete
            .map((order) => `'${order.id}'`)
            .join(',');
          await connection.query(
            `UPDATE orders SET status = ? WHERE id IN (${orderIds})`,
            [OrderStatus.COMPLETED]
          );

          const historyValues = ordersToComplete
            .map((order) => `('${order.id}', '${OrderStatus.COMPLETED}')`)
            .join(',');
          await connection.query(
            `INSERT INTO order_status_history (order_id, status) VALUES ${historyValues}`
          );
        }

        if (nextStopOrder >= total_stops) {
          await connection.query(`UPDATE routes SET status = ? WHERE id = ?`, [
            RouteStatus.COMPLETED,
            id,
          ]);

          const [remainingOrders] = await connection.query<RowDataPacket[]>(
            `SELECT id FROM orders WHERE route_id = ? AND status != ?`,
            [id, OrderStatus.COMPLETED]
          );

          if (remainingOrders.length > 0) {
            const remainingOrderIds = remainingOrders
              .map((order) => `'${order.id}'`)
              .join(',');
            await connection.query(
              `UPDATE orders SET status = ? WHERE id IN (${remainingOrderIds})`,
              [OrderStatus.COMPLETED]
            );

            const remainingHistoryValues = remainingOrders
              .map((order) => `('${order.id}', '${OrderStatus.COMPLETED}')`)
              .join(',');
            await connection.query(
              `INSERT INTO order_status_history (order_id, status) VALUES ${remainingHistoryValues}`
            );
          }
        }

        if (ordersToComplete.length > 0 || nextStopOrder >= total_stops) {
          await redis.del(`order_status:${id}`);
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
      console.error('Error updating current stop:', error);
      return false;
    }
  }
}
