import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import config from './config';
import logger from './logger';

morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

class MorganConfig {
  private static getIpFormat(): string {
    return config.env === 'production' ? ':remote-addr - ' : '';
  }

  private static successResponseFormat = `${MorganConfig.getIpFormat()}:method :url :status - :response-time ms`;

  private static errorResponseFormat = `${MorganConfig.getIpFormat()}:method :url :status - :response-time ms - message: :message`;

  public static successHandler = morgan(MorganConfig.successResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode >= 400,
    stream: { write: (message) => logger.info(message.trim()) },
  });

  public static errorHandler = morgan(MorganConfig.errorResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    stream: { write: (message) => logger.error(message.trim()) },
  });
}

export default MorganConfig;
