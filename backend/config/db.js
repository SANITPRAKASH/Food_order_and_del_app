import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sanit03:03tinas@cluster0.squos.mongodb.net/food-delivery');
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};
