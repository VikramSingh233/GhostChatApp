import User from "@/model/user.model";
import Message from "@/model/message.model";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { m } from "framer-motion";

export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const {user,currentUser} = reqBody;
        // console.log(user,currentUser);
        let conversation = await Message.findOne({
            $or: [
                { sender: user.MobileNumber, receiver: currentUser }, // { sender: sender, receiver: receiver },
                { sender: currentUser, receiver: user.MobileNumber }
            ]
        });
        if (!conversation) {
            return NextResponse.json({ message: `Start a conversation with ${user.Name}` }, { status: 404 });
        }

        const messages = conversation.messages;
        // console.log(messages);
        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message ,message:"Unable to fetch messages ! Check your internet connection" }, { status: 500 });
    }
}