import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';

const verifyCallback = (req: Request, resolve: Function, reject: Function, requiredRights: string[]) => async (err: Error, user: any, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    // @ts-ignore
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && (req.params.userId !== user.id || req.params.email !== user.email)) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();  // Assuming resolve is part of the promise chain that calls verifyCallback
};

const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: any, info: any) => {
      verifyCallback(req, resolve, reject, requiredRights)(err, user, info);
    })(req, res, next);
  })
  .then(() => next())
  .catch((err: Error) => next(err));
};

export default auth;
