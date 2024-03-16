import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema, ValidationResult } from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';

class ValidationMiddleware {
  public static validate(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const validSchema = pick(schema, ['params', 'query', 'body']);
      const object = pick(req, Object.keys(validSchema));
      const { value, error }: ValidationResult = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }

      Object.assign(req, value);
      return next();
    };
  }
}

export default ValidationMiddleware.validate;
