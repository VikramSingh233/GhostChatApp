import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/model/user.model";


export async function POST(request) {
  await connect();
  try {
    const body = await request.json();
    const { AllmobileNumbers } = body; // Expecting an array of numbers

    console.log("Received Mobile Numbers:", AllmobileNumbers);

    // Ensure AllmobileNumbers is a valid array
    if (!Array.isArray(AllmobileNumbers) || AllmobileNumbers.length === 0) {
      console.error("Invalid input: No numbers provided");
      return NextResponse.json({ error: "Invalid input: No numbers provided" }, { status: 400 });
    }

    // Fetch user details for the provided mobile numbers
    const users = await User.find({ MobileNumber: { $in: AllmobileNumbers } })
      .select("Name MobileNumber ProfilePicture");

    // console.log("Fetched Users:", users);

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

