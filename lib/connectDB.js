import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        console.log(`✅ Database is Connected`);
    } catch (error) {
        console.error("❌ Access to Database is error:", error);
    }
};
export default connectDB;