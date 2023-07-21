import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const connectToDatabase = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI)

        if (connected) {
            console.log(`Database connected successfully`);
        }
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        process.exit()
    }
}

export default connectToDatabase;