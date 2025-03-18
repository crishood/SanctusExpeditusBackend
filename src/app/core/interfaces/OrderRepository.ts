import {
  Order,
  OrderStatus,
  OrderStatusHistory,
} from '@app/core/models/Order.model';

export interface IOrderRepository {
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  getOrderStatusHistory(id: string): Promise<OrderStatusHistory[]>;
  getOrdersByUserEmail(email: string): Promise<Order[]>;
  createOrder(order: Partial<Order>): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
  updateOrderRoute(id: string, route_id: string): Promise<Order | null>;
  validateOrderAndRoute(
    id: string,
    route_id: string
  ): Promise<{ success: boolean; error?: string }>;
  updateTransporterCapacity(
    route_id: string,
    order_id: string
  ): Promise<boolean>;
}
