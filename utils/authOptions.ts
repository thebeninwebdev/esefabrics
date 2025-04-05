import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectMongoDB } from "./database"
import User from "../models/user"
import bcrypt from 'bcryptjs'

export const authOptions:NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
      CredentialsProvider({
        name:"credentials",
        credentials:{},
  
        async authorize(credentials:any){
          try {
            const {email,password} = credentials
            await connectMongoDB()
            const user = await User.findOne({
              $or:[
                {email},
                {username:email}
              ]
            })

            if(!user) return null

            user.last_login = new Date()
            
            await user.save()
            
            if(!user.verified) return null
  
            const matchPassword = await bcrypt.compare(password, user.password)
  
            if(!matchPassword) return null
  
            return user
          } catch (error) {
            console.log(error)
          }
          
        }
      }),
      // ...add more providers here
    ],
    callbacks: {
      async jwt ({ token, user}:any){
        if (user) {
          token._id = user._id
          token.email = user.email
          token.roles = user.roles; // Store roles in the JWT token
          
        };
        
  
        return token
      },
      async session ({ session, token, user}: any) {
        if (token) {
          session.user._id = token._id;
          session.user.email = token.email;
          session.user.roles = token.roles;
        }
      
        return session;
      }
    },
    session: {
      strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/'
    }
  }