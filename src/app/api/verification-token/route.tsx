import {NextResponse} from "next/server"
import {connectMongoDB} from "../../../../utils/database"
import User from "../../../../models/user"
import {Resend} from 'resend'
import { EmailTemplate } from "@/components/verifyEmailTemplate"
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req:Request){
    try{
        const {token } = await req.json()

        await connectMongoDB()

        if(!token){
            return NextResponse.json(
                {message:"All fields are required"},
                {status: 400}
            )
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const existingUser = await User.findOne({verifyToken:hashedToken})

        

        if (!existingUser) {
            return NextResponse.json({ message: 'user not found' }, { status: 400 });
        }

        const verifyToken = await crypto.randomBytes(20).toString('hex')

        const emailVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex")
    
        const emailVerifyExpires = Date.now() + 3600000
    
        existingUser.verifyToken = emailVerifyToken
    
        existingUser.verifyTokenExpiry = emailVerifyExpires
    
        await existingUser.save()
    
        const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email/${verifyToken}`
    
        const { data, error } = await resend.emails.send({
            from: 'mrEseosa_ <hello@mreseosa.com>',
            to: [existingUser.email],
            subject: 'Verify Account',
            react: EmailTemplate({ link: verifyUrl }),
            html: ""
          });
      
          if (error) {
            console.log(error)
            return NextResponse.json({ message:"An error occured while sending mail" }, { status: 500 });
          }

          return NextResponse.json({message:"check your mail"}, {status: 201})

    } catch(error){
        console.log(error)
        return NextResponse.json({
            message: "An error occured while sending mail."
        },
    {status: 500})
    }
}