import mongoose from 'mongoose';

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ Neither MONGODB_URI nor MONGO_URI is set. Set MONGODB_URI in environment variables.');
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection failed: ${err.name || 'DatabaseConnectionError'}`);
        process.exit(1);
    }
};
