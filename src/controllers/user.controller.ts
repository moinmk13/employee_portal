import { Request, Response } from "express";
import CatchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import userService from "../services/user.service";
import ApiError from "../utils/ApiError";
import lang from "../utils/language/english";
import pick from "../utils/pick";

class UserControllers {
    private catchAsyncInstance = CatchAsync;

    public getUsers = this.catchAsyncInstance.execute(
        async (req: Request, res: Response) => {
            let token = req.headers.authorization;
            if (token) {
                const filter = pick(req.query, ['email', 'first_name']);
                const options = pick(req.query, ['sortBy', 'limit', 'page']);
                const result = await userService.getAllUsers(filter, options);
                res.status(httpStatus.OK).send(result);
            } else {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    lang.common.authHeaderMissingError
                );
            }
        }
    );

    public getUserById = this.catchAsyncInstance.execute(
        async (req: Request, res: Response) => {
            let token = req.headers.authorization;
            const userId = req.params.userId;
            if (token) {
                const result = await userService.getUserById(userId);
                res.status(httpStatus.OK).send(result);
            } else {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    lang.common.authHeaderMissingError
                );
            }
        }
    );

    public deleteUser = this.catchAsyncInstance.execute(
        async (req: Request, res: Response) => {
            let token = req.headers.authorization;
            const userId = req.params.userId;
            if (token) {
                let body =  req.body
                const result = await userService.deleteUser(userId, body);
                res.status(httpStatus.OK).send(result);
            } else {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    lang.common.authHeaderMissingError
                );
            }
        }
    );


    public searchUsers = this.catchAsyncInstance.execute(
        async (req: Request, res: Response) => {
            try {
                let token = req.headers.authorization;
                if (token) {
                    const name = req.query.search;
                    // @ts-ignore
                    const result = await userService.searchUsers(name);
                    res.status(httpStatus.OK).send(result);
                } else {
                    throw new ApiError(httpStatus.BAD_REQUEST, lang.common.authHeaderMissingError);
                }
            } catch (error) {
                // @ts-ignore
                res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
            }
        }
    );
}

export default new UserControllers();
