import app from './app.js'
import connectToDatabase from '../config/db.js';

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
    await connectToDatabase()
    console.log(`App is running at http://localhost:${PORT}`);
})