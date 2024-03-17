import express, { Router } from "express";
import AuthController from "../../controllers/auth.controllers";
import employeeController from "../../controllers/employee.controller";

const router: Router = express.Router();

router.post("/", employeeController.createEmployee);
router.get("/", employeeController.getEmployees);
router.put("/:id", employeeController.editEmployee);
router.delete("/:id", employeeController.deleteEmployee);
router.get("/history", employeeController.findEmployeeHistory);
router.get(
  "/profile/:profileLink",
  employeeController.getEmployeeByProfileLink
);

export default router;
