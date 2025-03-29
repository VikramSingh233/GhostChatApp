import User from "@/model/user.model";
import Notification from "@/model/notification.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request) {
  
    const reqBody = await request.json();
    // console.log("req",reqBody);
    const {user, currentUser , data , time} = reqBody;
    // console.log("User", user, "currentUser" , currentUser , data , time);
    const receiver = user.MobileNumber;
    const receivername = user.Name;
    // console.log(currentUser);
    const usersender =await  User.findOne({MobileNumber:currentUser});
    // console.log(usersender);
    const sender = usersender.Name;
    const ProfilePicture = usersender.ProfilePicture;

    const message =data.message.toString() ;
    // console.log(message);
    
    const parsedDate = new Date(time);
    if (isNaN(parsedDate.getTime())) { 
        return NextResponse.json({ error: "Invalid date format received" });
    }
    const notification = new Notification({
        sender,
        receiver, 
        message,
        ProfilePicture,
        sendertime:parsedDate,
        receivername,
        seen:false
    });

    await notification.save();
    return NextResponse.json({ message: "Sent Successfully" }, { status: 200 });
}
   