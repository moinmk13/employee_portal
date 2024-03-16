import { Request, Response, NextFunction } from 'express';

class CatchAsync {
  public static execute(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
  }
}

export default CatchAsync;
