import mongoose from "mongoose";
import dotevn from "dotenv";

dotevn.config();

const mongoDB_URL = process.env.MONGODB_URL;

const connectDB = async (req, res) => {
  try {
    const connection = await mongoose.connect(mongoDB_URL);
    console.log("MongoDB connected Successfully");
    return connection;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Mongo DB connection Error" });
  }
};

export default connectDB;
