import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();

        const { MobileNumber, Name } = reqBody.user;
        const {currentPassword , newPassword , confirmPassword} = reqBody.formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({
                error: "All fields are required",
                status: 400,
            });
        }

        const user  = await User.findOne({ MobileNumber });
        if (!user) {
            return NextResponse.json({
                error: "User not found",
                status: 400,
            });
        }

        if (user.Password !== currentPassword) {
            return NextResponse.json({
                error: "Invalid current password",
                status: 400,
            });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({
                error: "Passwords do not match",
                status: 400,
            });
        }

        user.Password = newPassword;
        await user.save();
        
        
        return NextResponse.json("Password Changed Successfully", { status: 500 });

    } catch (error) {
        return NextResponse.json("Error While Changing Password", { status: 500 });
    }
}