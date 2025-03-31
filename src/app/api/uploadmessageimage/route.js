import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { connect } from "@/dbconfig/dbconfig";
import axios from "axios";
import User from "@/model/user.model";
import Message from "@/model/message.model";
// ✅ Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export async function POST(request) {
    await connect();
    try {
        const formData = await request.formData();

        const file = formData.get("file"); // Get the uploaded file
        const currentUser = JSON.parse(formData.get("currentUser")); // Parse JSON data
        const receiveruser = JSON.parse(formData.get("user"));

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }


        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);


        const result = await new Promise((resolve, reject) => {

            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { folder: "profile_pictures" },
                (error, res) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(res);
                    }
                }
            );


            uploadStream.end(buffer);
        });

    

        return NextResponse.json({ message: "Image uploaded successfully", url: result.secure_url }, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Error while sending file" }, { status: 500 });
    }
}
