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
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'canceled',
}
