import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/database";
import crypto from 'crypto'
import { NextResponse } from "next/server";
import { EmailTemplate } from "@/components/ResetPasswordEmailTemplate";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request:any) => {
    const {email} = await request.json()

    try {
        await connectMongoDB()

    const existingUser = await User.findOne({email})

    if(!existingUser){
        return NextResponse.json({message:"Email doesn't exist."}, {status: 400})
    }

    const resetToken = await crypto.randomBytes(20).toString('hex')

    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    const passwordResetExpires = Date.now() + 3600000

    existingUser.resetToken = passwordResetToken

    existingUser.resetTokenExpiry = passwordResetExpires

    await existingUser.save()

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`

    const { data, error } = await resend.emails.send({
        from: 'mrEseosa_ <hello@mreseosa.com>',
        to: [email],
        subject: 'Reset your password',
        react: EmailTemplate({ link: resetUrl }),
        html: ""
      });
  
      if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 });

      }
    return new NextResponse("Done", {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "An error occured"
        },
    {
        status: 500
    }
)
    }

    
}