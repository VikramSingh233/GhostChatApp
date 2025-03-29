import User from "@/model/user.model";
import Notification from "@/model/notification.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";


export async function POST(request) {
    await connect();
    const reqBody = await request.json();
    const { MobileNumber } = reqBody;
   
    const user = await User.findOne({ MobileNumber: MobileNumber });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const notifications = await Notification.find({
        $or: [{ receiver: MobileNumber }, { sender: user.Name }],
      }).sort({ sendertime: -1 });
    // console.log("notifications",notifications);

    // from all this notifications, get the ones that are not seen by the user

    const unseenNotifications = notifications.filter((notification) => {
        return notification.seen === false;
    });

  

    if (unseenNotifications.length > 0) {
        await Notification.updateMany(
            { _id: { $in: unseenNotifications.map((notification) => notification._id) } },
            { $set: { seen: true } }
        );
    }


    return NextResponse.json({ message: "Notifications marked as seen" }, { status: 200 });
    

}
