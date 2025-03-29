import { connect } from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/model/notification.model";


export async function POST(request) {

    try {
        await connect();
        const reqBody = await request.json();
        const { MobileNumber, NewMobileNumber } = reqBody;
        // console.log(MobileNumber , NewMobileNumber)
        if (!MobileNumber || !NewMobileNumber) {
            return NextResponse.json({
                error: "All fields are required",
                status: 400
            });
        }

        if (MobileNumber === NewMobileNumber) {
            return NextResponse.json({
                error: "Sorry, you can't add your own number",
                status: 400
            });
        }
        const user = await User.findOne({ MobileNumber });
        if (!user) {
            return NextResponse.json({
                error: "User not found",
                status: 400
            });
        }

        if (user.AddedNumbers.includes(NewMobileNumber)) {
            return NextResponse.json({
                error: "Number already exists in your contacts",
                status: 400
            });
        }



        if (user.BlockedNumbers.includes(NewMobileNumber)) {
            if (user.AddedNumbers.includes(NewMobileNumber)) {
                user.AddedNumbers.splice(user.AddedNumbers.indexOf(NewMobileNumber), 1);
            }
            return NextResponse.json({
                error: "Number already exists in BlockedNumbers",
                status: 400
            });

        


        }

        const receiver = await User.findOne({ MobileNumber: NewMobileNumber });
        if (!receiver) {
            return NextResponse.json({
                error: "Receiver not found",
                status: 400
            });
        }
        const now = new Date();
        const time = now.toISOString();


        const parsedDate = new Date(time);
        if (isNaN(parsedDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format received" });
        }


        

        user.AddedNumbers.push(NewMobileNumber);
        await user.save();


        const notification = new Notification({
            sender: user.Name,
            receiver: NewMobileNumber,
            message: MobileNumber,
            ProfilePicture: user.ProfilePicture,
            sendertime: parsedDate,
            receivername: receiver.Name,
            forAddNumber: true,
            seen: false
        });

        await notification.save();
        
        return NextResponse.json({
            message: "Number added successfully",
            AddedNumbers: user.AddedNumbers
        });
    } catch (error) {
        return NextResponse.json({
            error: error.message,
            status: 500
        });
    }
}

