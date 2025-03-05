import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
        });

        console.log('✅ Database connected.');
        return mongoose.connection;
    } catch (error) {
        console.error('❌ Database connection error:', error);
        throw new Error('Database connection failed.');
    }
};

export default db;
