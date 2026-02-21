import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Extend global type to include mongo cache
declare global {
  var mongo: { conn: typeof mongoose | null } | undefined;
}

// Use a global connection to avoid multiple instances during dev.
let cached = globalThis.mongo || { conn: null };

export async function connectToMongo() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  globalThis.mongo = cached;
  return cached.conn;
}
