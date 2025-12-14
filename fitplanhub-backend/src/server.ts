// Server startup
import * as http from "http";
import * as dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/database";
import { verifyCloudinaryConfig } from "./config/cloudinary";
import { verifyRazorpayConfig } from "./config/razorpay";
import { verifyEmailConfig } from "./config/email";
import { initializeSocket } from "./socket/socket";
import { startScheduler } from "./jobs/scheduler";

dotenv.config();

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    verifyCloudinaryConfig();
    verifyRazorpayConfig();
    verifyEmailConfig();
    startScheduler();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Env: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

startServer();
