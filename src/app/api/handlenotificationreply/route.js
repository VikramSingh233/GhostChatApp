import Notification from "@/model/notification.model";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request) {
    await connect();
    const { notification, reply ,time } = await request.json();
    // console.log(notification,reply, time);

     const parsedDate = new Date(time);
        if (isNaN(parsedDate.getTime())) { 
            return NextResponse.json({ error: "Invalid date format received" });
        }
        const updatedNotification = await Notification.findOneAndUpdate(
            { _id: notification._id },
            { 
                $set: { 
                    reply: reply, 
                    receivertime: parsedDate 
                }
            },
            { new: true } 
        );
    
    // console.log("updated", updatedNotification);
    return NextResponse.json({ message: "Sent Successfully" }, { status: 200 });
}