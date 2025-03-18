import { Response } from 'express';

export class HttpResponse {
  static error(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({ success: false, message, statusCode });
  }

  static success(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({ success: true, message, statusCode });
  }

  static successWithData(
    res: Response,
    message: string,
    data: any,
    statusCode: number
  ) {
    return res
      .status(statusCode)
      .json({ success: true, message, data, statusCode });
  }
}
