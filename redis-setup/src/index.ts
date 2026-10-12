
import "dotenv/config";
import express, { type Request, type Response } from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const REDIS_URL =
  process.env.REDIS_URL ?? "redis://localhost:6379";
const MONGO_URL =
  process.env.MONGO_URL ??
  "mongodb://localhost:27017/chai_and_redis";

const redis = new Redis(REDIS_URL);

// Test Redis connection
app.get("/redis", async (_req: Request, res: Response) => {
  try {
    const result = await redis.ping();

    res.json({
      success: true,
      message: "Redis connected successfully",
      response: result
    });
  } catch (error) {
    console.error("Redis error:", error);

    res.status(500).json({
      success: false,
      message: "Redis connection failed"
    });
  }
});

// Test MongoDB connection
app.get("/mongo", (_req: Request, res: Response) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    success: connected,
    message: connected
      ? "MongoDB connected successfully"
      : "MongoDB is not connected",
    database: mongoose.connection.name
  });
});

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);

    await redis.quit().catch(() => undefined);
    process.exitCode = 1;
  }
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

// async function shutdown(): Promise<void> {
//   await Promise.allSettled([
//     redis.quit(),
//     mongoose.disconnect()
//   ]);

//   process.exit(0);
// }

// process.once("SIGINT", () => {
//   void shutdown();
// });

// process.once("SIGTERM", () => {
//   void shutdown();
// });

// void startServer();
