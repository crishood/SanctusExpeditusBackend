import { Response } from 'express';

export class HttpResponse {
  static error(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({ error: message, statusCode });
  }

  static success(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({ message, statusCode });
  }

  static successWithData(res: Response, data: any, statusCode: number) {
    return res.status(statusCode).json({ data, statusCode });
  }
}
