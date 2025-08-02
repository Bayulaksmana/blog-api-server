import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    try {
        const connect = await mongoose.connect(uri);
        console.log(`✅ Database is Connected  ${connect.connection.host}`);
    } catch (err) {
        console.error("❌ Periksa pengaturan database di backend:", err.message);
    }
};
export default connectDB;