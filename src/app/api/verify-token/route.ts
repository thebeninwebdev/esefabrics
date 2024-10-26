import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/database";
import crypto from 'crypto'
import { NextResponse } from "next/server";

export const POST = async (request:any) => {
    const {token} = await request.json()

    try {
        await connectMongoDB()
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        // Find user by the verification token
        const user = await User.findOne({ verifyToken: hashedToken });

        if(!user){
            return NextResponse.json({ error: 'Invalid token or has expired.' }, { status: 400 });
        }

            // Check if the token is expired (assuming you store an expiration date)
        if (user.verifyTokenExpiry < new Date()) {
        // Token is expired
        return NextResponse.json({ error: 'Token expired' }, { status: 403 });
      }

        // If token is valid, return a success message
        return NextResponse.json({ message: 'Token valid, proceed to confirm account' }, { status: 200 });
        
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: "An error occured"
        },
    {
        status: 500
    }
)}}