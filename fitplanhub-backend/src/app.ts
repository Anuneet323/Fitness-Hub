// Main Express app setup
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

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads dir");
}

const app: Application = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://fit-plan-hub.vercel.app",
  "https://fit-plan-hub.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("CORS blocked:", origin);
      return callback(new Error("Not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/api", apiLimiter);

app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({
    message: "API v1.0.0",
    status: "running",
    ping: "/ping",
  });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
