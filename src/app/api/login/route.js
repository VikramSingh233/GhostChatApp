import { connect } from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";



export async function POST(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const { MobileNumber, Password } = reqBody;
    console.log(reqBody)
    // ✅ Check if all fields are provided
    if (!MobileNumber || !Password) {
      return NextResponse.json({
        error: "All fields are required",
        status: 400,
      });
    }

    // ✅ Find the user by Mobile Number
    const user = await User.findOne({ MobileNumber });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
        status: 400,
      });
    }

    // ✅ Check if the password matches
    if (user.Password !== Password) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 400,
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id, timestamp: Date.now() }, process.env.TOKEN_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });

    user.verifyToken = token;
    await user.save();

    // ✅ Set Cookie Properly
    const response = NextResponse.json({
      message: "Login successful",
      status: 200,
    });

    response.cookies.set("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "productionforchatapplication", 
      sameSite: "lax" 
    });


    // ✅ Return the response
    return response;
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
