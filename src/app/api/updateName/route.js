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
        const user = await User.findOne({ MobileNumber });
        if (!user) {
            return NextResponse.json({
                error: "User not found",
                status: 400,
            });
        }

        user.Name = Name;
        await user.save();

        return NextResponse.json("Name Updated Successfully");
    } catch (error) {
        return NextResponse.json("Error While Updating Name", { status: 500 });
    }
}