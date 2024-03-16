import { Request, Response } from 'express';
import { TokenService, Emails } from '../services';
import CatchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import lang from '../utils/language/english';

class EmailController {
  private catchAsyncInstance = CatchAsync;

  public emailSenders = this.catchAsyncInstance.execute(async (req: Request, res: Response) => {
    let token = req.headers.authorization
    if (token) {
      let body = await TokenService.verifyUser(token, req.body);
      const user = await Emails.sendEmails(body);
      res.status(httpStatus.CREATED).send({ ...user })
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, lang.common.authHeaderMissingError);
    }

  });
}

export default new EmailController();