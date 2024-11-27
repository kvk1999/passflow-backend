import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const resetAuthMiddleware = async (req, res,next) => {
  //getting token from request query
  const { token } = req.params;

  //checking token is missing
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SCRET_KEY);

    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Invalid Token.Token might be expired or session expired!",
      });
  }
};
