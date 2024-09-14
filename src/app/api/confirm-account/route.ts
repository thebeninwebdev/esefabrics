import User from "../../../../models/user"
import { connectMongoDB } from "../../../../utils/database"
import { NextResponse } from "next/server"
import crypto from 'crypto'

export const POST = async (request:any) => {
    const {token} = await request.json()

    try{
        await connectMongoDB()
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
        const existingUser = await User.findOne({verifyToken:hashedToken})
        

        if (!existingUser) {
            // If no user is found, return an error
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
          }

        existingUser.verified = true

        existingUser.verifyToken = undefined

        existingUser.verifyTokenExpiry = undefined
        
        await existingUser.save()

        // Account confirmed
        return NextResponse.json({ message: 'Account confirmed successfully' }, { status: 200 });
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