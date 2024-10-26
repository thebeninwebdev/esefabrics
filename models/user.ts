import {Schema, model, models, Document} from 'mongoose'

interface IUser extends Document {
    email: string;
    password: string;
    roles: string[]; // Array of roles, e.g., ['admin', 'user']
    verified: boolean;
    username: string;
    verifyToken:string;
    verifyTokenExpiry:string;
    resetToken:string;
    resetTokenExpiry:string;
  }

const UserSchema:Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: process.env.USER || ""
    }],
    verifyToken:String,
    verifyTokenExpiry:String,
    resetToken:String,
    resetTokenExpiry:String,
    verified: {
        type: Boolean,
        default: false
    }
})

const User = models.User || model<IUser>('User', UserSchema)

export default User