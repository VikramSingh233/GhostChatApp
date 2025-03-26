import { connect } from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request) {

    try {
        const reqBody = await request.json();
        const { MobileNumber, NewMobileNumber } = reqBody;
        console.log(MobileNumber , NewMobileNumber)
        if (!MobileNumber || !NewMobileNumber) {
            return NextResponse.json({
                error: "All fields are required",
                status: 400
            });
        }

        if(MobileNumber === NewMobileNumber) {
            return NextResponse.json({
                error: "Sorry, you can't add your own number", 
                status: 400
            });
        }
        const user = await User.findOne({ MobileNumber });
        if (!user) {
            return NextResponse.json({
                error: "User not found",
                status: 400
            });
        }

        if (user.AddedNumbers.includes(NewMobileNumber)) {
            return NextResponse.json({
                error: "Number already exists in AddedNumbers",
                status: 400
            });
        }

        if(user.BlockedNumbers.includes(NewMobileNumber)) {
            if (user.AddedNumbers.includes(NewMobileNumber)){
                user.AddedNumbers.splice(user.AddedNumbers.indexOf(NewMobileNumber), 1);
            }
            return NextResponse.json({
                error: "Number already exists in BlockedNumbers",
                status: 400
            });
        }

        user.AddedNumbers.push(NewMobileNumber);
        await user.save();

        console.log(user);
        return NextResponse.json({
            message: "Number added successfully",
            AddedNumbers: user.AddedNumbers
         });
    } catch (error) {
        return NextResponse.json({
            error: error.message,
            status: 500
        });
    }
}

   