import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/database";
import crypto from 'crypto'
import { NextResponse } from "next/server";

export const POST = async (request:any) => {
    const {token} = await request.json()

    try {
        await connectMongoDB()
        const passwordResetToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await User.findOne({
            resetToken: passwordResetToken,
            resetTokenExpiry: {$gt: Date.now()}
        })

        if(!user){
            return new NextResponse("Invalid token or has expired.", { status: 400})
        }

        return new NextResponse(JSON.stringify(user), {status: 200})
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: "An error occured"
        },
    {
        status: 500
    }
)}}