import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

export const refreshToken = async (req, res) => {
    try{
        const refreshedToken = req.cookies.refreshToken
        if(!refreshedToken){
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            });
        }
        const user = await User.findOne({ refreshToken : refreshedToken });
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        const verifyUser = jwt.verify(refreshedToken, process.env.JWT_REFRESH_SECRET);
        const generateTokenUser = generateToken({ id : verifyUser.id });

        res.status(200).json({
            success : true,
            message : "Refresh token generated successfully",
            data : {
                token : generateTokenUser,
                refreshToken : generateTokenUser
            }
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}