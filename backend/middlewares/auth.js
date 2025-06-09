// backend/middlewares/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { ErrorHandler } from "./error.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// Helper function to extract token from request
const extractToken = (req) => {
  // First try to get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Then try to get token from cookies
  if (req.cookies) {
    const cookieNames = ["token", "adminToken", "doctorToken", "patientToken"];
    for (const name of cookieNames) {
      if (req.cookies[name]) {
        return req.cookies[name];
      }
    }
  }

  // Finally try to get token from request body
  if (req.body && req.body.token) {
    return req.body.token;
  }

  return null;
};

// Base authentication middleware
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token format", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token has expired", 401));
    }
    return next(new ErrorHandler("Authentication failed", 401));
  }
});

// Middleware for admin routes
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ErrorHandler("Admin authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler("Admin user not found", 404));
    }

    if (user.role !== "Admin") {
      return next(new ErrorHandler("Admin access required", 403));
    }

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
  const token = extractToken(req);

  if (!token) {
    return next(new ErrorHandler("Patient authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler("Patient user not found", 404));
    }

    if (user.role !== "Patient") {
      return next(new ErrorHandler("Patient access required", 403));
    }

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
export const isDoctorAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ErrorHandler("Doctor authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler("Doctor user not found", 404));
    }

    if (user.role !== "Doctor") {
      return next(new ErrorHandler("Doctor access required", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid doctor token format", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Doctor token has expired", 401));
    }
    return next(new ErrorHandler("Doctor authentication failed", 401));
  }
});

// Flexible middleware to check if user is authorized for specific roles
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      console.log(`Role check failed: User role ${req.user.role} not in allowed roles ${roles}`);
      return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
    }
    next();
  };
};

// Optional: Middleware that works with any role-specific token
export const flexibleAuth = catchAsyncErrors(async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find user and attach to request
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    console.error("Flexible auth error:", error);
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token format", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token has expired", 401));
    }
    return next(new ErrorHandler("Authentication failed", 401));
  }
});
