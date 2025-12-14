// ========================================
// src/app.ts - UPDATED with Vercel + Localhost CORS
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

// ✅ UPDATED CORS - Supports localhost + Vercel + Render frontend
const allowedOrigins = [
  "http://localhost:5173",        // Vite dev server
  "http://localhost:3000",        // Create React App
  "https://fit-plan-hub.vercel.app",  // Vercel production
  "https://fit-plan-hub.onrender.com" // Render production
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(`🚫 CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
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

// ✅ PING ENDPOINT - Wakes Render server
app.get("/ping", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🎯 Welcome to FitPlanHub API",
    version: "1.0.0",
    status: "running",
    ping: "/ping",
    documentation: "/api/health",
    corsAllowed: allowedOrigins
  });
});

// API routes - IMPORTANT: This must come before error handlers
app.use("/api", routes);

// 404 handler
app.use(notFound);

// Global error handler - This must be last
app.use(errorHandler);

export default app;
