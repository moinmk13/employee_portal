import httpStatus from "http-status";
import lang from "../utils/language/english";
import Employee from "../models/employee.model";
import { employees } from "../types/employees";

class EmployeeServices {
    public async createEmployee(req: employees) {
        try {
            const employee = await Employee.create(req);
            return {
                result: employee,
                status: httpStatus.CREATED,
                message: "Employee created successfully",
            };
        } catch (error) {
            throw error;
        }
    }

    public async getQuery(res: employees) {
        try {
            const data = await Employee.find();
            return {
                result: data,
                status: httpStatus.OK,
                message: "Employee fetched succesfully",
            };
        } catch (err) {
            throw err;
        }
    }

    public async updateEmployee(id: string, req: employees) {
        try {
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                return {
                    status: httpStatus.NOT_FOUND,
                    message: lang.skills.skillsNotFound,
                }
            }

            existingEmployee.set(req);
            await existingEmployee.save();
            return {
                data: existingEmployee.toObject(),
                status: httpStatus.OK,
                message: "Employee update succesfully",
            }

        } catch (err) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: lang.common.internalError,
            }
        }
    }

    public async removeEmployee(id: string) {
        try {
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                return {
                    status: httpStatus.NOT_FOUND,
                    message: lang.skills.skillsNotFound,
                }
            }

            await existingEmployee.remove();
            return {
                status: httpStatus.OK,
                message: "Employee deleted succesfully", 
            }

        } catch (error) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: lang.common.internalError,
            }
        }
    }


}

export default new EmployeeServices();
