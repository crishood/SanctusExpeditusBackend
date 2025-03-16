import { MySQLOrderRepository } from './MySQLOrderRepository';
import { Order, OrderStatus } from '@app/core/models/Order.model';

export class OrderService {
  private _orderRepository: MySQLOrderRepository;

  constructor() {
    this._orderRepository = new MySQLOrderRepository();
  }

  async getAllOrders(): Promise<Order[]> {
    return await this._orderRepository.getOrders();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this._orderRepository.getOrderById(id);
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    return await this._orderRepository.createOrder(order);
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    return await this._orderRepository.updateOrderStatus(id, status);
  }

  async updateOrderRoute(id: string, route_id: string): Promise<Order | null> {
    return await this._orderRepository.updateOrderRoute(id, route_id);
  }

  async updateTransporterCapacity(
    route_id: string,
    order_id: string
  ): Promise<boolean> {
    return await this._orderRepository.updateTransporterCapacity(
      route_id,
      order_id
    );
  }
}
