import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Data_CostBoardingHouse'); // URL diambil dari env

        console.log("Database connected successfully");

    } catch (error) {
        console.error("Failed to connect to database:", error);
    }
};

export default connectDB;