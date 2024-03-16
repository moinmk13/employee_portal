import { Request, Response } from 'express';
import httpStatus from 'http-status';
import CatchAsync from '../utils/catchAsync';
import userService from '../services/user.service';

class AuthController {
  private catchAsyncInstance = CatchAsync;

  public signUp = this.catchAsyncInstance.execute(async (req: Request, res: Response) => {
    const result = await userService.signUp(req.body);
    res.status(httpStatus.CREATED).send(result);
  })

  public signIn = this.catchAsyncInstance.execute(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.status(result.status).send(result);
  })

}


export default new AuthController();
