import httpStatus from "http-status";
import lang from "../utils/language/english";
import Employee from "../models/employee.model";
import { employees } from "../types/employees";
import EmployeeHistory from "../models/employeeHistory.model";

class EmployeeServices {
    public async createEmployee(req: employees) {
        try {
            const employee = await Employee.create({ ...req });
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

    //   public async updateEmployee(id: string, req: employees) {
    //     try {
    //       const existingEmployee = await Employee.findById(id);
    //       if (!existingEmployee) {
    //         return {
    //           status: httpStatus.NOT_FOUND,
    //           message: lang.skills.skillsNotFound,
    //         };
    //       }

    //       const historyEntries = [];
    //       for (const [key, value] of Object.entries(req)) {
    //         const oldValue = existingEmployee[key];
    //         existingEmployee[key] = value;
    //         historyEntries.push({
    //           employeeId: id,
    //           field: key,
    //           oldValue: oldValue,
    //           newValue: value,
    //         });
    //       }

    //       await Promise.all([
    //         existingEmployee.save(),
    //         EmployeeHistory.insertMany(historyEntries),
    //       ]);

    //       return {
    //         data: existingEmployee.toObject(),
    //         status: httpStatus.OK,
    //         message: "Employee updated successfully",
    //       };
    //     } catch (err) {
    //       return {
    //         status: httpStatus.INTERNAL_SERVER_ERROR,
    //         message: lang.common.internalError,
    //       };
    //     }
    //   }

    public async updateEmployee(id: string, req: employees) {
        try {
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                return {
                    status: httpStatus.NOT_FOUND,
                    message: "Employee not found",
                };
            }

            const historyEntries = [];
            for (const [key, value] of Object.entries(req)) {
                const oldValue = existingEmployee[key];
                existingEmployee[key] = value;
                historyEntries.push({
                    field: key,
                    oldValue: oldValue,
                    newValue: value,
                });
            }

            existingEmployee.history.push(...historyEntries);

            await existingEmployee.save();

            return {
                data: existingEmployee.toObject(),
                status: httpStatus.OK,
                message: "Employee updated successfully",
            };
        } catch (err) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: lang.common.internalError,
            };
        }
    }

    public async removeEmployee(id: string) {
        try {
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                return {
                    status: httpStatus.NOT_FOUND,
                    message: "Employee not found",
                };
            }

            await existingEmployee.remove();
            return {
                status: httpStatus.OK,
                message: "Employee deleted succesfully",
            };
        } catch (error) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: lang.common.internalError,
            };
        }
    }

    public async employeeHistory(res: employees) {
        try {
            const data = await EmployeeHistory.find();
            return {
                result: data,
                status: httpStatus.OK,
                message: "Employee history fetched succesfully",
            };
        } catch (err) {
            throw err;
        }
    }

    //   public async getEmployeeByUniqueLink(uniqueLink: string) {
    //     try {
    //       const employee = await Employee.findOne({ uniqueLink });
    //       if (!employee) {
    //         return {
    //           status: httpStatus.NOT_FOUND,
    //           message: "Employee not found",
    //         };
    //       }

    //       return {
    //         status: httpStatus.OK,
    //         result: employee,
    //         message: "Employee details retrieved successfully",
    //       };
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
}

export default new EmployeeServices();
