import { Schema, model } from "mongoose";
import validator from 'email-validator'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be atleast 5 character'],
        maxLength: [20, 'Name should be less than 20 character'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            "^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,})+$",
            'Please fill in a valid email address'
        ]
    },
    password: {
        type: String,
        requried: [true, 'Password is required'],
        select: true,
        minLength: [8, 'Password must be at least 8 characters']
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    roll: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
}, {
    timestamps: true
});

const userModel = model('User', userSchema);
export default userModel;