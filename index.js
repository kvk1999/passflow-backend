import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import userrouter from "./Routers/userRouter.js";

dotenv.config();

const app = express();

//middle ware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
connectDB();
//routes
app.use("/api", userrouter);


app.get("/", (req, res) => {
  res.status(200).send("API running Successfully");
});

//Port
app.listen(process.env.PORT, () => {
  console.log("Server is running on port localhost:3001");
});
