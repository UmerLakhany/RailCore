import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate } from 'class-validator';
import { ClassType } from './types';

/**
 * Validates req.body against a class-validator DTO.
 * On success, req.body is replaced with the DTO instance (unknown fields are stripped).
 */
function validateDTO<T extends object>(DTOClass: ClassType<T>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.generalError('Validation Error!', { errors: ['Request body must be a JSON object'] }, 400);
      }

      const dtoInstance = Object.assign(new DTOClass(), req.body);
      const errors = await validate(dtoInstance, { whitelist: true, forbidUnknownValues: true });

      if (errors.length > 0) {
        const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}));
        return res.generalError('Validation Error!', { errors: errorMessages }, 400);
      }

      req.body = dtoInstance;
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default validateDTO;
