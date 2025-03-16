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
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_order: number;
  city: string;
}
