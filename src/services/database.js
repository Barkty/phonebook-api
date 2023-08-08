/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

mongoose.set('strictQuery', false);

const { DATABASE_URL } = process.env

/**
 * Connect to database
 */
export const connect = async (uri) => {
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to database");
    }
};

/**
 * Connect to other databases depending on environment
 */
export const connectDB = async () => {
    await connect(DATABASE_URL);
};
