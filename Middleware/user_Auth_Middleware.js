import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const userAuthMiddleware = async (req, res,next) => {
  //getting token from the headers authorization
 // const token = req.header('Authorization')
 const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SCRET_KEY);

    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Invalid Token/Internal Server Error" });
  }
};
