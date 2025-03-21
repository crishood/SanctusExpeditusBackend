export interface Order {
  id: string;
  user_id: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  product_type: string;
  destination_address: string;
  delivery_city: string;
  route_id: string;
  status: OrderStatus;
  created_at: Date;
  delivered_at: Date;
  user_email: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_at: Date;
}
