import { RouteStatus } from '../models/Route.model';

export interface IRouteRepository {
  updateRouteStatus(id: string, status: RouteStatus): Promise<boolean>;
  updateCurrentStop(id: string): Promise<boolean>;
}
