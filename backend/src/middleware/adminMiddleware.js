import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { isTokenBlacklished } from "../controllers/authControllers.js";

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // check token is empty
    if (!token) return res.status(401).json({ message: "No token provided" });

    // check if token is blacklished
    if (isTokenBlacklished(token)) {
      return res.status(401).json({ message: "Token is No longer valid" });
    }

    // decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.userId);

    // if user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    // if user is not admin
    if(user.role !== "admin"){
        return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      })
    }

    req.user = user
    next()

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
      error: error.message
    })
  }
};
