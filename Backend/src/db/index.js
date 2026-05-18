import mongoose from "mongoose";

const mongoBaseUrl = process.env.MONGODB_URL;
const mongoDbName = process.env.DB_NAME;

if (!mongoBaseUrl || !mongoDbName) {
  throw new Error("Missing MongoDB env vars: MONGODB_URL and DB_NAME are required");
}

const MONGODB_URI = `${mongoBaseUrl}/${mongoDbName}`;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectdb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, 
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected");
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
};

export default connectdb;