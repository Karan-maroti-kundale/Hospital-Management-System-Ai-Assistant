// backend/middlewares/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { ErrorHandler } from "./error.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// Helper function to extract token from request
const extractToken = (req, cookieName) => {
  // First try to get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Then try to get token from cookies
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }

  return null;
};

// Base authentication middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again."
    });
  }
};

// Middleware for admin routes
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = extractToken(req, "token");

    if (!token) {
      return next(new ErrorHandler("Admin authentication required", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and validate
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Admin user not found", 404));
    }

    // Check if user has admin role
    if (user.role !== "Admin") {
      return next(new ErrorHandler("Admin access required", 403));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid admin token format", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Admin token has expired", 401));
    }
    return next(new ErrorHandler("Admin authentication failed", 401));
  }
});

// Middleware for patient routes
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = extractToken(req, "token");

    if (!token) {
      return next(new ErrorHandler("Patient authentication required", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and validate
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Patient user not found", 404));
    }

    // Check if user has patient role
    if (user.role !== "Patient") {
      return next(new ErrorHandler("Patient access required", 403));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid patient token format", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Patient token has expired", 401));
    }
    return next(new ErrorHandler("Patient authentication failed", 401));
  }
});

// Middleware for doctor routes
export const isDoctorAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== "Doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctors only."
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Doctor auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again."
    });
  }
};

// Flexible middleware to check if user is authorized for specific roles
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

// Optional: Middleware that works with any role-specific token
export const flexibleAuth = catchAsyncErrors(async (req, res, next) => {
  try {
    // Try different token sources in order of preference
    const tokenSources = ["token", "adminToken", "doctorToken", "patientToken"];
    let token = null;

    for (const source of tokenSources) {
      token = extractToken(req, source);
      if (token) break;
    }

    if (!token) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token format", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token has expired", 401));
    }
    return next(new ErrorHandler("Authentication failed", 401));
  }
});
