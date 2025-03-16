import { Response } from 'express';

export class HttpResponse {
  static error(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({ error: message, statusCode });
  }
}
