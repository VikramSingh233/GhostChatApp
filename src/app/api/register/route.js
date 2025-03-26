import {connect} from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt"
import jwt from "jsonwebtoken";

connect()

export async function POST(request) {

    try{
        const reqBody = await request.json();
        const {Name,Password,MobileNumber} = reqBody;
 
        if(!Name || !MobileNumber || !Password){
            return NextResponse.json({
                
                error:"All fields are required",
                status:400
    
            })
           }

           const user = await User.findOne({MobileNumber});
       if(user){
        return NextResponse.json({
            
            error:"User already exists",
            status:400
        })
       }
       const newUser = new User({
        Name,
        MobileNumber,
        Password:Password
       })

       const savedUser = await newUser.save();

       return NextResponse.json({
            message:"User created successfully",
            success:true,
            savedUser
       })
    } catch (error) {
        return NextResponse.json({
            error:error.message,
            status:500
        })
    }
}