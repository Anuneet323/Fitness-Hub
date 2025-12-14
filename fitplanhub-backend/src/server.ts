// ========================================
// src/server.ts
// ========================================
import * as http from "http";
import * as dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/database";
import { verifyCloudinaryConfig } from "./config/cloudinary";
import { verifyRazorpayConfig } from "./config/razorpay";
import { verifyEmailConfig } from "./config/email";
import { initializeSocket } from "./socket/socket";
import { startScheduler } from "./jobs/scheduler";

// Load environment variables
dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Verify external service configurations
    verifyCloudinaryConfig();
    verifyRazorpayConfig();
    verifyEmailConfig();

    // Start cron jobs
    startScheduler();

    // Start listening
    server.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 FitPlanHub Backend Server                       ║
║                                                       ║
║   📡 Server running on: http://localhost:${PORT}     ║
║   🌍 Environment: ${
        process.env.NODE_ENV || "development"
      }                      ║
║   📊 API Documentation: http://localhost:${PORT}/api ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();
