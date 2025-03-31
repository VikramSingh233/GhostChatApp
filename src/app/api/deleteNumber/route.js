import User from "@/model/user.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const { user, currentUser } = reqBody;

        console.log("User:", user, "CurrentUser:", currentUser);

        
        const userNumber = user.MobileNumber;

       
        const currUser = await User.findOne({ MobileNumber: currentUser });
        if (!currUser) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

     
        currUser.AddedNumbers = currUser.AddedNumbers.filter((number) => number !== userNumber);

       if(currUser.RecentlyDeletedNumbers.includes(userNumber)) return NextResponse.json({ message: "Number already deleted" }, { status: 400 });
        currUser.RecentlyDeletedNumbers.push(userNumber);

        
        await currUser.save();

        console.log("Updated User:", currUser);
        return NextResponse.json({ message: "Number deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting number:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
