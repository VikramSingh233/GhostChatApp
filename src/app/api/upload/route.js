import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { connect } from "@/dbconfig/dbconfig";
import axios from "axios";
import User from "@/model/user.model";
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
    const mobileNumber = request.headers.get("mobileNumber");

    const file = formData.get("file"); // ✅ Get the uploaded file

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

  
    User.findOne({ MobileNumber: mobileNumber }).then((user) => {
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      else{
        if(user.ProfilePicturePublicId){
          cloudinary.v2.uploader.destroy(user.ProfilePicturePublicId);
          user.ProfilePicturePublicId = "";
          user.ProfilePicture = "";
        }
        user.ProfilePicture = result.secure_url;
        user.ProfilePicturePublicId = result.public_id;
        user.save();
      }
    })
    const user = await User.findOne({ MobileNumber: mobileNumber });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
