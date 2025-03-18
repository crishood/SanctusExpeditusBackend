import { RouteStatus } from '@app/core/models/Route.model';
import { MySQLRouteRepository } from './MySQLRouteRepository';

export class RouteService {
  private _routeRepository: MySQLRouteRepository;

  constructor() {
    this._routeRepository = new MySQLRouteRepository();
  }

  async updateRouteStatus(id: string, status: RouteStatus): Promise<boolean> {
    return await this._routeRepository.updateRouteStatus(id, status);
  }

  async updateCurrentStop(id: string): Promise<boolean> {
    return await this._routeRepository.updateCurrentStop(id);
  }
}
