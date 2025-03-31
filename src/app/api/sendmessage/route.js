import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";
import Message from "@/model/message.model";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const { messageData } = reqBody;

        const user = await User.findOne({ MobileNumber: messageData.receiver });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }


        const sender = messageData.sender;
        const receiver = messageData.receiver;

        let conversation = await Message.findOne({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        });

    
        if (!conversation) {
            conversation = new Message({
                sender: sender < receiver ? sender : receiver, // Sort sender/receiver to maintain consistency
                receiver: sender < receiver ? receiver : sender,
                messages: [
                    {
                        sender, // Actual sender of the message
                        receiver, // Actual receiver of the message
                        text: messageData.text,
                        timestamp: new Date(messageData.timestamp)
                    }
                ]
            });
        } else {
            
            conversation.messages.push({
                sender,
                receiver,
                text: messageData.text,
                timestamp: new Date(messageData.timestamp)
            });
        }

      
        await conversation.save();

        return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message, message: "Unable to send message! Check your internet connection" }, { status: 500 });
    }
}
