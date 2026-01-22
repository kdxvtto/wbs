import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isBlacklisted } from "../utils/blacklistToken.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")?.[1];
    try{
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            });
        }
        if(isBlacklisted(token)){
            return res.status(401).json({
                success : false,
                message : "Token has been revoked"
            });
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verify.id);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        req.user = user;
        next();
    }catch(error){
        return res.status(401).json({
            success : false,
            message : "Invalid token"
        });
    }
}