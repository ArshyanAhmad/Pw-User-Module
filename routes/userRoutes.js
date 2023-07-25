import express from "express";
const Router = express.Router()

import { getProfile, login, logout, register } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

Router.post('/register', upload.single('avatar'), register)
Router.post('/login', login)

Router.get('/me', isLoggedIn, getProfile)
Router.get('/logout', logout)

export default Router;