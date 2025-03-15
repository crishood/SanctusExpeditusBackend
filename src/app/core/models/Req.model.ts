import { Request } from 'express';
import { User } from './User.model';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
