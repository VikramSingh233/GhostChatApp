import Notification from "@/model/notification.model";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request) {

   try {
     await connect();
     const { notification } = await request.json();
    //  console.log(notification);
     const updatedNotification = await Notification.findOneAndDelete({ _id: notification._id });
    //  console.log("updated", updatedNotification);
     return NextResponse.json({ message: "Deleted Successfully" }, { status: 200 });
   } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
   }
}