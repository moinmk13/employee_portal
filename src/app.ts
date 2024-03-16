import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import jwtStrategy from './config/passport';
import authLimiter from './middlewares/rateLimiter';
import router from './routes/v1';
import ErrorMiddleware from './middlewares/error';
import ApiError from './utils/ApiError';
import fileUpload from 'express-fileupload';

class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    if (config.env !== 'test') {
      this.app.use(morgan.successHandler);
      this.app.use(morgan.errorHandler);
    }

    this.app.use(fileUpload({
      useTempFiles: true
    }))

    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(xss());
    this.app.use(mongoSanitize());
    this.app.use('/uploads', express.static('uploads'));
    this.app.use(compression());
    this.app.use(cors());
    this.app.options('*', cors());
    this.app.use(passport.initialize());
    // @ts-ignore
    passport.use('jwt', jwtStrategy);

    if (config.env === 'production') {
      this.app.use('/v1/auth', authLimiter);
    }
  }

  private initializeRoutes() {
    this.app.use('/v1', router);

    this.app.get('/', (req: Request, res: Response) => {
      res.send('Navigate to <a href="https://localhost:3000/v1/docs/">https://localhost:3000/v1/docs/</a> API documentation');
    });

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });

    this.app.use(ErrorMiddleware.errorConverter);
    this.app.use(ErrorMiddleware.errorHandler);
  }
}

export default new App().app;
