import { RequestHandler, Request, Response } from 'express';
import { OrderService } from './OrderService';
import { SUCCESS_MESSAGES } from '@app/core/constants/success';
import { HttpResponse } from '@app/utils/HttpResponse';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { Order } from '@app/core/models/Order.model';

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
      const order: Partial<Order> = {
        user_id: req.body.user.id,
        weight: req.body.weight,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
        product_type: req.body.product_type,
        delivery_city: req.body.delivery_city,
        destination_address: req.body.destination_address,
      };
      const data = await this._orderService.createOrder(order);
      res.json({
        success: true,
        data: data,
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
