import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";



export async function POST(request) {
    await connect();
    const reqBody = await request.json();
    // console.log(reqBody);

    const {contacts,mobileNumber} = reqBody;
    // console.log(contacts,mobileNumber);
     const user = await User.findOne({MobileNumber:mobileNumber});
     if(!user) return NextResponse.json({ message: "User not found" }, { status: 400 });

    contacts.forEach(number => {
        user.BlockedNumbers = user.BlockedNumbers.filter(num => num === number);
        user.AddedNumbers.push(number);
    });

    

    await user.save();

    return NextResponse.json({ message: "Success" }, { status: 200 });
}