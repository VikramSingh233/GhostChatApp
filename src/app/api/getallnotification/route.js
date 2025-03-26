import User from "@/model/user.model";
import Notification from "@/model/notification.model";
import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";


export async function POST(request) {
    await connect();
  

}
