import Notification from "@/model/notification.model";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request) {

   try {
     await connect();
     const { notification } = await request.json();
    //  console.log(notification); // array of notifications

     await Notification.deleteMany({ _id: { $in: notification } });

     return NextResponse.json({ message: "All notifications deleted" }, { status: 200 });
   } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
   }
}