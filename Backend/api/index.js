import "dotenv/config";
import app from "../src/app.js";
import connectdb from "../src/db/index.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectdb();
    isConnected = true;
  }

  return app(req, res);
}
