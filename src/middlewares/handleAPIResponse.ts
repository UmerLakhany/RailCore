import type { Request, Response, NextFunction } from 'express';
import APIResponse from '../lib/classes/APIResponse';

declare global {
  namespace Express {
    interface Response {
      generalResponse(message: string, data?: any, statusCode?: number): void;
      generalError(message: string, data?: any, errorCode?: number | null, responseCodeDescription?: string | null): void;
    }
  }
}

/** Attaches consistent success/error JSON helpers to every response. */
export default function handleAPIResponse(req: Request, res: Response, next: NextFunction): void {
  res.generalResponse = function (message: string, data: any = null, statusCode = 200): void {
    res.status(statusCode).json(APIResponse.success(message, data, statusCode));
  };

  res.generalError = function (
    message: string,
    data: any = null,
    errorCode: number | null = null,
    responseCodeDescription: string | null = null,
  ): void {
    const code = errorCode || 400;
    res.status(code).json(APIResponse.error(message, code, data, responseCodeDescription));
  };

  next();
}
