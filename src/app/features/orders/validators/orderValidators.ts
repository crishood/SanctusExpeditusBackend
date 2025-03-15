import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '@app/core/constants/errors';
import { validations } from '@app/utils/validations';

export class OrderValidators {
  static validateCreateOrderInput(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const {
      user_id,
      weight,
      length,
      width,
      height,
      product_type,
      destination_address,
    } = req.body;

    const requiredFields = {
      user_id,
      weight,
      length,
      width,
      height,
      product_type,
      destination_address,
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

    next();
  }
}
