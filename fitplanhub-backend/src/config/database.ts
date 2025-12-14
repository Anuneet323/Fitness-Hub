// Database connection - MongoDB setup 
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MONGO_URI missing from env");
    }

    // Connect to MongoDB Atlas/local
    const conn = await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected:', conn.connection.host);
    console.log('DB name:', conn.connection.name);

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error('DB connection error:', err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn('DB disconnected - reconnecting...');
    });

    mongoose.connection.on("reconnected", () => {
      console.log('DB reconnected');
    });

    // Cleanup on shutdown (Ctrl+C)
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log('DB connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Quick health check for API routes
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      if (db) {
        await db.admin().ping();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('DB health check failed:', error);
    return false;
  }
};

// Get basic DB stats - useful for admin dashboard
export const getDatabaseStats = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.error('No DB connection');
      return null;
    }

    const stats = await db.stats();
    return {
      collections: stats.collections,
      dataSize: `${(stats.dataSize / (1024 * 1024)).toFixed(2)} MB`,
      indexes: stats.indexes,
      indexSize: `${(stats.indexSize / (1024 * 1024)).toFixed(2)} MB`,
    };
  } catch (error) {
    console.error('DB stats error:', error);
    return null;
  }
};
