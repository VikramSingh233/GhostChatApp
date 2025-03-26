import User from "@/model/user.model";
import Notification from "@/model/notification.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request) {
  
    const reqBody = await request.json();
    console.log("req",reqBody);
    const {user, currentUser , data , time} = reqBody;

    const sender = user.MobileNumber;
    const receiver = currentUser;
    const message =data.message.toString() ;
    console.log(message);
    
    const parsedDate = new Date(time);
    if (isNaN(parsedDate.getTime())) { 
        return NextResponse.json({ error: "Invalid date format received" });
    }
    const notification = new Notification({
        sender,
        receiver, 
        message,
        sendertime:parsedDate,
    });

    await notification.save();
    return NextResponse.json({ message: "Sent Successfully" }, { status: 200 });
}
   