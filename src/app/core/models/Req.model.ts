import { Request } from 'express';
import { User } from './User.model';
import { Order } from './Order.model';
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ReqWithUpdatedOrder extends Request {
  updatedOrder?: Order;
}
