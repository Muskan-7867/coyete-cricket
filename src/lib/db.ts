
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection?.readyState >= 1) {
            return;
        }
        
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Error connecting to DB:", error);
        throw error;
    }
}

export default connectDB;