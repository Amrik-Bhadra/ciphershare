import mongoose from "mongoose";

export const connectToDB = async() => {
    const mongo_uri = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongo_uri as string);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.log('❌ Failed to connect to DB, ', error);
        process.exit(1);
    }
}