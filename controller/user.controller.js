import userModel from "../models/user.model.js"
import AppError from "../utils/error.util.js";

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

    await user.save()
    user.password = undefined;

    const token = await userModel.generateJWTToken()
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

export { register, login, logout, getProfile }
