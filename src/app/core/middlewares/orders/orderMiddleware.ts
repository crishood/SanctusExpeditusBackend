import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { FormFieldValidator } from '@app/utils/FormFieldValidator';
import { MySQLOrderRepository } from '@app/features/orders/MySQLOrderRepository';

export class OrderValidators {
  private _orderRepository: MySQLOrderRepository;

  constructor(orderRepository: MySQLOrderRepository) {
    this._orderRepository = orderRepository;
  }

  async validateCreateOrderInput(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      weight,
      length,
      width,
      height,
      product_type,
      destination_address,
      delivery_city,
    } = req.body;

    const requiredFields = {
      weight,
      length,
      width,
      height,
      product_type,
      destination_address,
      delivery_city,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);
    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: `${ERROR_MESSAGES.INVALID_ORDER_INPUT}: Missing required fields [${missingFields.join(', ')}]`,
        statusCode: 400,
      });
      return;
    }

    const validationChecks = {
      weight: FormFieldValidator.validateWeight(weight),
      length: FormFieldValidator.validateLength(length),
      width: FormFieldValidator.validateWidth(width),
      height: FormFieldValidator.validateHeight(height),
    };

    const validationErrors = Object.entries(validationChecks)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_ORDER_FIELDS,
        statusCode: 400,
      });
      return;
    }

    const isValidAddress =
      await FormFieldValidator.validateAddress(destination_address);
    if (!isValidAddress) {
      res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_ORDER_ADDRESS,
        statusCode: 400,
      });
      return;
    }

    next();
  }

  async validateOrderAndRoute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { route_id } = req.body;
    const { success, error } =
      await this._orderRepository.validateOrderAndRoute(id, route_id);
    if (!success) {
      res.status(400).json({ success, error, statusCode: 400 });
      return;
    }
    next();
  }
}
