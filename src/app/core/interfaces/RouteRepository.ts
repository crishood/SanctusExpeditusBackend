import { RouteStatus } from '../models/Route.model';
import { Route } from '../models/Route.model';
export interface IRouteRepository {
  updateRouteStatus(id: string, status: RouteStatus): Promise<boolean>;
  updateCurrentStop(id: string): Promise<boolean>;
  getRoutes(): Promise<Route[]>;
}
