import User from "../Models/userSchema.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { mail } from "../Services/nodemail.js";

dotenv.config();

//Add New User or Register New User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //checking if value is entered
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please the required fields" });
    }

    //validating email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please Enter valid Email!" });
    }

    //checking if email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        message:
          "This Email is already registered. Kindly use another Email to register",
      });
    }

    //hashing password
    const hashpassword = await bcrypt.hash(password, 10);

    //adding new user
    const newUser = await User({ username, email, password: hashpassword });
    await newUser.save();

    res.status(200).json({
      message: "Your Email registered Successfully ! 😊",
      result: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error in Register User" });
  }
};

//Login User
export const logingUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validating email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address." });
    }

    //checking the user is a registered user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "User Not Found!" });
    }

    //checking password
    const checkPassword = await bcrypt.compare(password, user.password);

    //invalid password
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Password ! 😓" });
    }

    //creating token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SCRET_KEY, {
      expiresIn: "12hr",
    });

    res.status(200).json({ message: "Login Successful !👍", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error in Login User" });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //validating email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    //checking if the user is registered
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.Please Register !" });
    }
    //  console.log(user);
    //creating token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SCRET_KEY, {
      expiresIn: "12hr", 
    });
    const resetpassword = `http://localhost:3001/reset-password/${user._id}/${token}`;

    const mailLink = await mail(user.email, "Reset Password" ,resetpassword); 

    if (mailLink) {
      return res   
        .status(200)
        .json({
          message: "The password reset link has been sent to provided Email",
          token: token,
        });
    } else {
      throw new Error("Failed to sent Reset Link");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error in Forgot Password",
    });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const {id} = req.params;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.status(400).json({ message: "Password doesn't match" });
    }
    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.findById(id);
    //console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found " });
     
    }
    
    user.password = hashpassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//get user
export const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User details fetched successfully", result: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in get user" });
  }
};
