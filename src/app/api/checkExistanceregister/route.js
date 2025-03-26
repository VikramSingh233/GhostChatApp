import {connect} from "@/dbconfig/dbconfig";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt"
import jwt from "jsonwebtoken";

connect()

export async function POST(request) {
    try{
        const reqBody = await request.json();
        const {MobileNumber} = reqBody;
 
        if(!MobileNumber){
            return NextResponse.json({
                
                error:"All fields are required",
                status:400
    
            })
           }

           const user = await User.findOne({MobileNumber});
           
       if(!user){
        return NextResponse.json({
            
            error:"User not using this service",
            status:400
        })
       }
       


       const response = NextResponse.json({message:"User exists",data:user},{status:200},{data:user})
       return response
    }catch(error){
        return NextResponse.json({error:error.message,status:500})
        }
       }