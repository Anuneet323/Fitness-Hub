// ========================================
// src/app.ts - FIXED
// ========================================
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler.middleware";
import { apiLimiter } from "./middleware/rateLimiter.middleware";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting
app.use("/api", apiLimiter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🎯 Welcome to FitPlanHub API",
    version: "1.0.0",
    status: "running",
    documentation: "/api/health",
  });
});

// API routes - IMPORTANT: This must come before error handlers
app.use("/api", routes);

// 404 handler - This catches routes that don't match anything above
app.use(notFound);

// Global error handler - This must be last
app.use(errorHandler);

export default app;
