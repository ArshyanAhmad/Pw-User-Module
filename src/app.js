import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from '../routes/userRoutes.js'
config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/ping', (req, res) => {
    res.send('/pong')
})



// routes of 3 modules
app.use('/api/v1/user', userRoutes)

app.use('*', (req, res) => {
    res.status(404).send('OOPS! 404 page not found')
})

export default app;

