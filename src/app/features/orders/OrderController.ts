import { RequestHandler, Request, Response } from 'express';
import { OrderService } from './OrderService';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';
import { HttpResponse } from '@app/utils/HttpResponse';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export class OrderController {
  constructor(private _orderService: OrderService) {}

  public getOrders: RequestHandler = async (req: Request, res: Response) => {
    try {
      const orders = await this._orderService.getAllOrders();
      res.json({
        success: true,
        data: orders,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public getOrderById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await this._orderService.getOrderById(id);
      if (!order) {
        HttpResponse.orderNotFound(res);
        return;
      }
      res.json({
        success: true,
        data: order,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public createOrder: RequestHandler = async (req: Request, res: Response) => {
    try {
      const order = await this._orderService.createOrder(req.body);
      res.json({
        success: true,
        data: order,
        statusCode: 201,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public updateOrderStatus: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const order = await this._orderService.updateOrderStatus(id, req.body);
      if (!order) {
        HttpResponse.orderNotFound(res);
        return;
      }
      res.json({
        success: true,
        data: order,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };

  public updateOrderRoute: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const order = await this._orderService.updateOrderRoute(id, req.body);
      if (!order) {
        HttpResponse.orderNotFound(res);
        return;
      }
      res.json({
        success: true,
        data: order,
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      });
    }
  };
}
