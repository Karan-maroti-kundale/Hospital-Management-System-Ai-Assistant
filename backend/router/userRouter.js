// backend/router/userRouter.js
import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from "../controller/userController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.js";
import { User } from "../models/userSchema.js";

const router = express.Router();

// Public routes
router.post("/patientRegister", register);
router.post("/adminRegister", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes
router.get("/me", isAuthenticated, getMe);
router.put("/update", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);

// Admin routes - only accessible by Admin role
router.get("/doctors", isAuthenticated, isAuthorized(["Admin"]), async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" })
      .select("-password")
      .populate("department", "name");
    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error("Fetch doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors"
    });
  }
});

// Add new doctor - Admin only
router.post("/doctor/addnew", isAuthenticated, isAuthorized(["Admin"]), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new doctor
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Doctor",
      department: doctorDepartment
    });

    // Remove password from response
    const doctorWithoutPassword = { ...doctor.toObject() };
    delete doctorWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: doctorWithoutPassword
    });
  } catch (error) {
    console.error("Add doctor error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add doctor"
    });
  }
});

// Add new admin - Admin only
router.post("/admin/addnew", isAuthenticated, isAuthorized(["Admin"]), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new admin
    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Admin"
    });

    // Remove password from response
    const adminWithoutPassword = { ...admin.toObject() };
    delete adminWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: "Admin added successfully",
      admin: adminWithoutPassword
    });
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add admin"
    });
  }
});

export default router;
