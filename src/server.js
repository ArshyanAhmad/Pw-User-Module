import app from './app.js'
import connectToDatabase from '../config/db.js';
import cloudinary from 'cloudinary'

const PORT = process.env.PORT || 5000

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.listen(PORT, async () => {
    await connectToDatabase()
    console.log(`App is running at http://localhost:${PORT}`);
})