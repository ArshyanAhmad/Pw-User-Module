import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods = {
    generateJWTToken: async function () {
        return await JWT.sign(
            { id: this._id, email: this.email, subscription: this.subscription, roll: this.roll }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        )
    },

    comparePassowrd: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password)
    }
}



const userModel = model('User', userSchema);
export default userModel;