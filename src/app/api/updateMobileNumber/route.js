import { connect } from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
    
        const { Name, MobileNumber } = reqBody;

        if (!Name || !MobileNumber) {
            return NextResponse.json({
                error: "All fields are required",
                status: 400,
            });
        }
        const user = await User.findOne({ Name });
        if (!user) {
            return NextResponse.json({
                error: "User not found",
                status: 400,
            });
        }
        // checking for the number that it cant exists previously 
        const checkNumber = await User.findOne({MobileNumber})
        if(checkNumber){
            return NextResponse.json({
                error: "Mobile Number already exists",
                status: 400,
            })
        }

        user.MobileNumber = MobileNumber;
        await user.save();

        return NextResponse.json("Mobile Number Updated Successfully");
    } catch (error) {
        return NextResponse.json("Error While Updating Mobile Number", { status: 500 });
    }
}