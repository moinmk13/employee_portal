// import { User } from "../models/user.model";
import httpStatus from "http-status";
import lang from "../utils/language/english";
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

class UserDataServices {
  [x: string]: any;
  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  public async getUserById(id: string): Promise<any> {
    const exiestingUser = await User.findById(id).populate("profile");
    try {
      if (!exiestingUser) {
        return {
          status: httpStatus.NOT_FOUND,
          message: lang.user.notFound,
        }
      }

      return {
        result: exiestingUser,
        status: httpStatus.OK,
        message: lang.user.findOne
      }
    } catch (error) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: lang.common.internalError,
      };
    }
  }

  public async getAllUsers(filter: any, options: any) {
    try {
      // @ts-ignore
      const { page, limit, totalPages, totalResults, recordsPresent } = await User.paginate(filter, options);
      const result = await User.find(filter).populate('profile');
      const data = {
        users: result,
        page,
        limit,
        totalPages,
        totalResults,
        recordsPresent,
      };
      return {
        result: data,
        status: httpStatus.OK,
        message: lang.user.getAll,
      };
    } catch (error) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: lang.common.internalError,
      };
    }
  }

  public async deleteUser(userId: string, req: any) {
    try {
      const exiestingUser = await User.findById(userId);
      if (!exiestingUser) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: lang.user.notFound,
        };
      }

      await User.remove();
      return {
        statusCode: httpStatus.OK,
        message: lang.user.deleteUser,
      };
    } catch (error) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: lang.common.internalError,
      };
    }
  }

  public async signUp(req: any) {
    try {
      const data = await User.create(req);
      return {
        result: data,
        status: httpStatus.CREATED,
        message: 'User register succesfully',
      }
    } catch (error) {
      console.log(error);
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: lang.common.internalError,
      };
    }
  }

  public async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return {
          status: httpStatus.UNAUTHORIZED,
          message: 'Invalid email or password',
        };
      }

      const isPasswordMatch = await user.isPasswordMatch(password);

      if (!isPasswordMatch) {
        return {
          status: httpStatus.UNAUTHORIZED,
          message: 'Invalid email or password',
        };
      }
      return {
        status: httpStatus.OK,
        message: 'Login successful',
        user: user.toJSON(),
      };
    } catch (error) {
      console.log(error);
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: lang.common.internalError,
      };
    }
  }

}

export default new UserDataServices();
