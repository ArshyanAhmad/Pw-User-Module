import userModel from "../models/user.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs'
import sendEmail from "../utils/sendEmail.js";

const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required! ', 400))
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
        return next(new AppError('Email already exits ', 400))
    }

    const user = await userModel.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg'
        }
    })

    if (!user) {
        return next(new AppError('User registration failed, please try again ', 400))
    }

    // TODO : FILE UPLOAD

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            })


            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // Remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }

        } catch (error) {
            return next(new AppError(error || 'File not uploaded, Please try again', 500))
        }
    }

    await user.save()
    user.password = undefined;

    const token = await user.generateJWTToken()
    res.cookie('token', token, cookieOption)

    res.status(201).json({
        success: true,
        message: 'User register successfully',
        user
    })

}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All fields are required! ', 400))
        }

        const user = await userModel.findOne({ email }).select('+password')

        if (!user || !user.comparePassowrd(password)) {
            return next(new AppError('Email or password does not match', 400))
        }

        const token = await user.generateJWTToken()
        user.password = undefined;

        res.cookie('token', token, cookieOption)

        res.status(200).json({
            success: true,
            message: 'User loggedin successfully',
            user
        })
    }
    catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    })
}

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId)

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        })

    } catch (error) {
        return next(new AppError('Failed to fetch profile detail ', 500))
    }
}

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400))
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new AppError('Email not registered', 400))
    }

    const resetToken = await user.generatePasswordResetToken()

    await user.save()

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank"> Reset your password </a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore it.`

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`
        })
    } catch (e) {
        user.forgotPasswordExpiry = undefined
        user.forgotPasswordToken = undefined

        await user.save()
        return next(new AppError(`Something went wrong ${e.message}`, 500))
    }
}

const resetPassword = () => {

}

export { register, login, logout, getProfile, forgotPassword, resetPassword }
