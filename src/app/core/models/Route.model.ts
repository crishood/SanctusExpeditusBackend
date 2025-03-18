export interface Route {
  id: string;
  transporter_id: string;
  origin: string;
  destination: string;
  status: RouteStatus;
  created_at: Date;
}

export enum RouteStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_order: number;
  city: string;
}
