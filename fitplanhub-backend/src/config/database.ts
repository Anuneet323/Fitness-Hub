// ========================================
// src/config/database.ts
// ========================================
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
      // These options are no longer needed in Mongoose 6+
      // but included for backward compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected successfully");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      if (db) {
        await db.admin().ping();
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};

// Get database stats
export const getDatabaseStats = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database connection not established");
      return null;
    }

    const stats = await db.stats();
    return {
      collections: stats.collections,
      dataSize: (stats.dataSize / (1024 * 1024)).toFixed(2) + " MB",
      indexes: stats.indexes,
      indexSize: (stats.indexSize / (1024 * 1024)).toFixed(2) + " MB",
    };
  } catch (error) {
    console.error("Error getting database stats:", error);
    return null;
  }
};
