import { Request, Response } from "express";
import CatchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import cloudinaryUpload from "../middlewares/cloudinary";
import cloudinary from "cloudinary";
import employeeService from "../services/employee.service";
import Employee from "../models/employee.model";
// @ts-ignore
import shortid from "shortid";

// @ts-ignore
cloudinaryUpload.upload;

class EmployeeControllers {
  private catchAsyncInstance = CatchAsync;

  // public createEmployee = this.catchAsyncInstance.execute(
  //   async (req: Request, res: Response) => {
  //     // if (!req.files || !req.files.profile_pic) {
  //     //   throw new ApiError(httpStatus.BAD_REQUEST, "Profile image is missing");
  //     // }
  //     // const profile_pic = req.files.profile_pic;
  //     try {
  //       // @ts-ignore
  //       // const result = await cloudinary.uploader.upload(profile_pic.tempFilePath);
  //       const postData = { ...req.body };

  //       // Create employee with profile pic URL
  //       const user = await employeeService.createEmployee(postData);

  //       res.status(httpStatus.CREATED).send(user);
  //     } catch (error) {
  //       console.log(error);
  //       throw new ApiError(
  //         httpStatus.INTERNAL_SERVER_ERROR,
  //         "Error uploading image"
  //       );
  //     }
  //   }
  // );

  public createEmployee = this.catchAsyncInstance.execute(
    async (req: Request, res: Response) => {
      if (!req.files || !req.files.profile_pic) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Profile image is missing");
      }
      const profile_pic = req.files.profile_pic;
      try {
        // @ts-ignore
        const result = await cloudinary.v2.uploader.upload(profile_pic.tempFilePath);
        const profileLink = shortid.generate(); // Generate unique link
        const postData = {
          ...req.body,
          profile_pic: result.secure_url,
          profileLink,
        };

        const user = await employeeService.createEmployee(postData);

        res.status(httpStatus.CREATED).send(user);
      } catch (error) {
        console.log(error);
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error uploading image"
        );
      }
    });

  public getEmployees = this.catchAsyncInstance.execute(
    async (req: Request, res: Response) => {
      const user = await employeeService.getQuery(req.body);
      res.status(httpStatus.OK).send(user);
    }
  );

  public editEmployee = this.catchAsyncInstance.execute(
    async (req: Request, res: Response) => {
      const id = req.params.id;
      // @ts-ignore
      const user = await employeeService.updateEmployee(id, req.body);
      res.status(httpStatus.CREATED).send(user);
    }
  );

  public deleteEmployee = this.catchAsyncInstance.execute(
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const data = await employeeService.removeEmployee(id);
      res.status(httpStatus.OK).send(data);
    }
  );

  public findEmployeeHistory = this.catchAsyncInstance.execute(
    async (req: Request, res: Response) => {
      const user = await employeeService.employeeHistory(req.body);
      res.status(httpStatus.OK).send(user);
    }
  );

  public getEmployeeByProfileLink = async (req: Request, res: Response) => {
    try {
      const { profileLink } = req.params;
      const employee = await Employee.findOne({ profileLink });

      if (!employee) {
        return res.status(httpStatus.NOT_FOUND).send("Employee not found");
      }

      return res.status(httpStatus.OK).send(employee);
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("Internal Server Error");
    }
  };
}

export default new EmployeeControllers();
