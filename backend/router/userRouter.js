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

// Doctor routes
router.get("/doctors", isAuthenticated, async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" })
      .select("-password")
      .populate("department", "name");
    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors"
    });
  }
});

// Dashboard specific routes
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

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add doctor"
    });
  }
});

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

    res.status(201).json({
      success: true,
      message: "Admin added successfully",
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add admin"
    });
  }
});

export default router;
