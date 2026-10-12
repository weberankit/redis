
import "dotenv/config";
import express, { type Request, type Response } from "express";
import Redis from "ioredis";
import {SITE_BANNER_KEY } from "./constant.ts";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379"
);


// 1. SET: Save or update the banner message.
app.post("/banner", async (req: Request, res: Response) => {
  try {
    const message: string =
      typeof req.body?.message === "string"
        ? req.body.message
        : " Welocme to the brand new platform";

    await redis.set(SITE_BANNER_KEY, message);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to set banner:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save banner"
    });
  }
});

// 2. GET: Retrieve the banner message.
app.get("/banner", async (_req: Request, res: Response) => {
  try {
    const message = await redis.get(SITE_BANNER_KEY);

    res.json({ message });
  } catch (error) {
    console.error("Failed to get banner:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve banner"
    });
  }
});

// 3. EXISTS: Check whether the banner key exists.
app.get(
  "/banner/exists",
  async (_req: Request, res: Response) => {
    try {
      const exists = await redis.exists(SITE_BANNER_KEY);
       console.log(exists,"existes")
      res.json({ exists: Boolean(exists) });
    } catch (error) {
      console.error("Failed to check banner:", error);

      res.status(500).json({
        success: false,
        message: "Failed to check banner"
      });
    }
  }
);

// 4. DELETE: Remove the banner key.
app.delete("/banner", async (_req: Request, res: Response) => {
  try {
    const deleted = await redis.del(SITE_BANNER_KEY);

    res.json({
      success: true,
      deleted: deleted === 1
    });
  } catch (error) {
    console.error("Failed to delete banner:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete banner"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function shutdown(): Promise<void> {
  await redis.quit();
  process.exit(0);
}

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});
