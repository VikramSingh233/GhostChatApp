import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const { MobileNumber } = reqBody;
        const user = await User.findOne({ MobileNumber });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }
        user.AddedNumbers = user.AddedNumbers.filter((number) => number !== MobileNumber);
        await user.save();
        return NextResponse.json({ message: "Number deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}