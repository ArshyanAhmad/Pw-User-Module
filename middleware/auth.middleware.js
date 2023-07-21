import AppError from "../utils/error.util.js";
import JWT from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthenticated, please login again'), 401)
    }

    const userDetail = await JWT.verify(token, process.env.JWT_SECRET);

    req.user = userDetail;

    next()

}

export {
    isLoggedIn
};