import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/database";
import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server";
import crypto from 'crypto'

export const POST = async (request:any) => {
    const {token,password} = await request.json()
    try {
        await connectMongoDB()

        const resetVerifyToken = crypto.createHash("sha256").update(token).digest("hex")

        const existingUser = await User.findOne({resetToken:resetVerifyToken})

        if(!existingUser){
            return new NextResponse("Invalid token or has expired.", { status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        existingUser.password = hashedPassword

        existingUser.resetToken = undefined

        existingUser.resetTokenExpiry = undefined

        await existingUser.save()

        return new NextResponse("User's password is updated", {status: 200})
    }catch(error){
        console.log(error)
        return new NextResponse( 
            "An error occured",
    {
        status: 500
    }
)
    }
}