import { connect } from "@/dbconfig/dbconfig";

import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request){
    try {
        const reqBody = await request.json();

        // console.log(reqBody);

        const user = reqBody.user.MobileNumber;
        const currUser = reqBody.currentUser;
        
        const curruser =await  User.findOne({MobileNumber:currUser});
        if(!curruser){
            return NextResponse.json({message:"User not found"})
        }
        if(curruser.AddedNumbers.includes(user)){
            curruser.AddedNumbers.splice(curruser.AddedNumbers.indexOf(user),1);
            await curruser.save();
        }
        // console.log(curruser)
        if(curruser.BlockedNumbers.includes(user)){
            return NextResponse.json({message:"User already blocked"})
        }
    //    console.log(curruser)
        curruser.BlockedNumbers.push(user);
        await curruser.save();

       
        //  console.log(curruser);
        
        return NextResponse.json({message:"User Blocked Successfully"},{status:200},{data:reqBody})
    } catch (error) {
        return NextResponse.json({error:error.message,status:500})
    }
}