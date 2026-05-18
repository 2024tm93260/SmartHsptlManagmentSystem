import "dotenv/config";
import app from "../src/app.js";
import connectdb from "../src/db/index.js";

let isConnected = false;

export default async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectdb();
      isConnected = true;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }

  return app(req, res);
}
