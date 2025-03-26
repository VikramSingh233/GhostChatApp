import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";

export async function GET() {
  try {
    await connect();

    const cookieStore =await  cookies(); 
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No Token Found", status: 401 });
    }

    const SECRET_KEY = process.env.TOKEN_SECRET || "TOKEN_SECRET";
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    return NextResponse.json({
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return NextResponse.json({ error: "Invalid Token", status: 401 });
  }
}
