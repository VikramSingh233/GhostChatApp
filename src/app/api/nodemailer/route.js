import { NextResponse } from "next/server";
import sendMail from "@/helpers/mailer";

export async function POST(request) {
  try {
    const { email, contactReason, message, name } = await request.json();
    
    if (!email || !contactReason || !message || !name) {
      return NextResponse.json({ error: "All fields are required", status: 400 });
    }

    await sendMail({ email, contactReason, message, name });

    return NextResponse.json({ message: "Message sent successfully", success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
