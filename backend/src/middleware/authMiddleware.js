import jwt from 'jsonwebtoken'
import { isTokenBlacklished } from '../controllers/authControllers.js';


export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1];

    // if not token return no token
    if(!token) return res.status(401).json({message: "No token provided"})

    // check if token is blacklished
    if(isTokenBlacklished(token)) {
        return res.status(401).json({message: "Token is No longer valid"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { _id: decoded.userId };  /// send user to request so res can get user
        next();
    } catch (error) {
        res.status(401).json({message: `Invalid or errro ${error}`})
    }

}