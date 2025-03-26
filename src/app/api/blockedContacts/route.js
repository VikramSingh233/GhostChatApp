import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";


export async function POST(request) {
    await connect()
    // console.log("request", request);
    const reqBody = await request.json();
    const { MobileNumber } = reqBody;
    // console.log("MobileNumber", MobileNumber);
    const user = await User.findOne({ MobileNumber });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    
    const blockedNumbers = user.BlockedNumbers;
    
    return NextResponse.json({ message: "Success", blockedNumbers }, { status: 200 });
}