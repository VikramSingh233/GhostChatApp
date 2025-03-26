import { connect } from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { cookies } from "next/headers";

connect();

export async function POST(request) {
     try {
    
        const coockie =await cookies()
        const token  =coockie.get("token")?.value;
        if (!token) {
          return NextResponse.json({ error: "No Token Found", status: 401 });
        }
        const SECRET_KEY = process.env.TOKEN_SECRET || "TOKEN_SECRET";
        const decoded = jwt.verify(token, SECRET_KEY);
    
        const user = await User.findById(decoded.id);

        user.verifyToken = "";
        await user.save();
        coockie.delete("token");
     
        return NextResponse.json({ message: "Logged out successfully" });
      } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return NextResponse.json({ error: "Invalid Token", status: 500 });
      }
}