import userModel from "../models/user.model.js"
import AppError from "../utils/error.util.js";

const register = (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return new AppError('All fields are required! ', 400)
    }


}

const login = (req, res) => {
    const
}

const logout = (req, res) => {

}

const getProfile = (req, res) => {

}

export { register, login, logout, getProfile }
