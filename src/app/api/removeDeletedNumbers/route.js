import User from "@/model/user.model";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const {selectedNumbers ,curruser} = reqBody;

        const user = await User.findOne({MobileNumber:curruser});
        if(!user) return NextResponse.json({ message: "User not found" }, { status: 400 });
        user.RecentlyDeletedNumbers = user.RecentlyDeletedNumbers.filter((number) => !selectedNumbers.includes(number));
        // push to addednumbers
        user.AddedNumbers.push(...selectedNumbers);
        await user.save();
        console.log("AddedNumbers",user)
        return NextResponse.json({ message: "Numbers removed successfully" }, { status: 200 });
        
        
    } catch (error) {
        
    }
}