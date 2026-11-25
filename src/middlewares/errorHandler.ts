import { Request, Response, NextFunction } from 'express';
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';
import APIResponse from '../lib/classes/APIResponse';

/** Throw this from services for expected (non-500) failures. */
export class ErrorResponse extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ErrorResponse';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ErrorResponse) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof UniqueConstraintError) {
    // must be checked before ValidationError (it is a subclass)
    statusCode = 409;
    message = 'Duplicate entry found.';
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors[0]?.message || 'Validation error';
  } else if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = req.method === 'DELETE'
      ? 'Cannot delete record due to dependent data.'
      : 'Cannot save record due to invalid related data.';
  } else if (err?.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON body';
  }

  if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const description = process.env.NODE_ENV === 'development' && statusCode >= 500 ? err?.stack : null;
  res.status(statusCode).json(APIResponse.error(message, statusCode, null, description));
};

export default errorHandler;
