import { Response } from 'express';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export class HttpResponse {
  static userNotFound(res: Response, message = ERROR_MESSAGES.USER_NOT_FOUND) {
    return res.status(404).json({ error: message });
  }

  static badRequest(res: Response, message = ERROR_MESSAGES.BAD_REQUEST) {
    return res.status(400).json({ error: message });
  }

  static internalError(
    res: Response,
    message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  ) {
    return res.status(500).json({ error: message });
  }
}
