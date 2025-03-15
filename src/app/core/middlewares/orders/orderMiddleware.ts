import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { validations } from '@app/utils/validations';

export class OrderValidators {
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
        error: ERROR_MESSAGES.INVALID_ORDER_INPUT,
        statusCode: 400,
      });
      return;
    }

    const validationChecks = {
      weight: validations.weight(weight),
      length: validations.length(length),
      width: validations.width(width),
      height: validations.height(height),
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
      await validations.validateAddress(destination_address);
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
}
