import { RequestHandler, Request, Response } from 'express';
import { RouteService } from './RouteService';
import { HttpResponse } from '@app/utils/HttpResponse';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';

export class RouteController {
  constructor(private _routeService: RouteService) {}

  public updateRouteStatus: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const success = await this._routeService.updateRouteStatus(id, status);
      console.log(success);
      if (!success) {
        HttpResponse.error(res, ERROR_MESSAGES.ROUTE_NOT_FOUND, 404);
        return;
      }
      HttpResponse.success(res, SUCCESS_MESSAGES.ROUTE_STATUS_UPDATED, 200);
    } catch (error) {
      HttpResponse.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }
  };
}
