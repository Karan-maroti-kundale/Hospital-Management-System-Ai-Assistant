import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDoctorsByDepartment
} from "../controller/departmentController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// Department routes
router.post("/add", isAuthenticated, isAuthorized(["Admin"]), createDepartment);
router.get("/getall", getAllDepartments);
router.get("/get/:id", getDepartmentById);
router.put("/update/:id", isAuthenticated, isAuthorized(["Admin"]), updateDepartment);
router.delete("/delete/:id", isAuthenticated, isAuthorized(["Admin"]), deleteDepartment);
router.get("/doctors/:departmentId", getDoctorsByDepartment);

export default router; 