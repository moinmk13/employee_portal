import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

class ErrorMiddleware {
  public static errorConverter(err: any, req: Request, res: Response, next: NextFunction): void {
    let error = err;
    if (!(error instanceof ApiError)) {
      const statusCode =
        error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
  }

  public static errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
      code: statusCode,
      message,
      ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
      console.log("err", err)
    }

    res.status(statusCode).send(response);
  }
}

export default ErrorMiddleware;
