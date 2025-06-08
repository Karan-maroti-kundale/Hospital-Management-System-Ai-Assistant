// backend/app.js
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";

// Import routers
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import newsRouter from "./router/newsRouter.js";
import aiRouter from "./router/aiRouter.js"; // ✅ AI Router
import hospitalGuideRouter from "./router/hospitalGuideRouter.js";
import departmentRouter from "./router/departmentRouter.js";

const app = express();

// Load env variables
config({ path: "./config/config.env" });

// CORS Configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/ai", aiRouter); // ✅ Mount the AI routes
app.use("/api/v1/hospital-guide", hospitalGuideRouter);
app.use("/api/v1/department", departmentRouter);

// Database connection
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

// Default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Hospital Management System API",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
