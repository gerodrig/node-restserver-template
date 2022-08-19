import mongoose from "mongoose";
import 'dotenv/config';

export const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB is connected");
    } catch (error) {
        console.log(error);
        throw new Error('Error connecting to database');
    }




    
}