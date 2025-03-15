import { Response } from 'express';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

export class HttpResponse {
  static userNotFound(res: Response, message = ERROR_MESSAGES.USER_NOT_FOUND) {
    return res.status(404).json({ error: message });
  }

  static badRequest(res: Response, message: string) {
    return res.status(400).json({ message });
  }

  static unauthorized(res: Response, message: string) {
    return res.status(401).json({ message });
  }

  static internalError(res: Response, message: string) {
    return res.status(500).json({ message });
  }

  static error(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({ error: message });
  }
}
