import express from "express";
import { forgotPassword, getUser, logingUser, registerUser, resetPassword } from "../Controllers/userController.js";
//import { resetAuthMiddleware } from "../Middleware/resest_Password_Auth_Middleware.js";
import { userAuthMiddleware } from "../Middleware/user_Auth_Middleware.js";
import { resetAuthMiddleware } from "../Middleware/resest_Password_Auth_Middleware.js";

const router = express.Router();

router.post("/login-user",logingUser);
router.post("/register-user",registerUser);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:id/:token",resetAuthMiddleware,resetPassword);
router.get("/user-info/:email",userAuthMiddleware,getUser);

export default router;
