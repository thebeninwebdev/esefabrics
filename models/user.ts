import {Schema, model, models, Document} from 'mongoose'

interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    created_at: Date;
    updated_at?: Date;
    last_login: Date;
    bio?: string;
    password: string;
    username: string;
    roles: string[];
    verifyToken?: string;
    verifyTokenExpiry?: string;
    resetToken?: string;
    resetTokenExpiry?: string;
    verified: boolean;
  }

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: Date,
    last_login: Date,
    bio: String,
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