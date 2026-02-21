import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToMongo();
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connected successfully!",
      database: process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] || "connected"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "MongoDB connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
