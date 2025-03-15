import { Order, OrderStatus } from '@app/core/models/Order.model';

export interface IOrderRepository {
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Partial<Order>): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
  updateOrderRoute(id: string, route_id: string): Promise<Order | null>;
}
