// backend/controller/userController.js
import { User } from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, gender, phone } = req.body;

    console.log("Registration attempt:", { email, role }); // Debug log

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !gender || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: firstName, lastName, email, password, gender, phone"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email); // Debug log
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "Patient", // Default to Patient if role not specified
      gender,
      phone
    });

    console.log("User created successfully:", { email, role }); // Debug log

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    // Remove password from response
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    // Set token in cookie based on role
    const cookieName = `${user.role.toLowerCase()}Token`;
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration error details:", error); // Detailed error log
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register user"
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    console.log("Login attempt:", { email, role }); // Debug log

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check role if specified
    if (role && user.role !== role) {
      console.log("Role mismatch:", { expected: role, actual: user.role }); // Debug log
      return res.status(401).json({
        success: false,
        message: `Invalid role. Please login as ${user.role}`
      });
    }

    // Check password using schema method
    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid); // Debug log

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token with role
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    // Remove password from response
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    // Set token in cookie based on role
    const cookieName = `${user.role.toLowerCase()}Token`;
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error details:", error); // Detailed error log
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

// Logout user
export const logout = (req, res) => {
  // Clear all role-specific cookies
  const cookieNames = ["token", "adminToken", "doctorToken", "patientToken"];
  cookieNames.forEach(name => {
    res.clearCookie(name);
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password"
    });
  }
};
