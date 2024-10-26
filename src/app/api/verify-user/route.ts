import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../utils/database";
import User from "../../../../models/user";

export async function POST(req:Request){
    try {
        await connectMongoDB(); // Ensure database connection
    const { email } = await req.json();

    // Find user by email
    const user = await User.findOne({
        $or:[
          {email},
          {username:email}
        ]
      });

    if (!user) {
      // User does not exist
      return new Response(JSON.stringify({ error: 'No user found with this email' }), { status: 404 });
    }

    if (!user.verified) {
      // User exists but not verified
      return new Response(JSON.stringify({ error: 'Please verify your email before logging in' }), { status: 403 });
    }

    // User exists and is verified
    return new Response(JSON.stringify({ message: 'User verified' }), { status: 200 });
  } catch (error) {
    // Handle server errors
    return new Response(JSON.stringify({ error: 'An error occurred while verifying the user' }), { status: 500 });
  }
}