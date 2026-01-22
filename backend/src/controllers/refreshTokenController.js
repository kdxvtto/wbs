import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

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
        // Verify token validity (will throw error if expired/invalid)
        jwt.verify(refreshedToken, process.env.JWT_REFRESH_SECRET);
        
        // Generate new access token dengan id dan role
        const newAccessToken = generateToken({ id: user._id, role: user.role });
        
        // Generate new refresh token dengan id dan role
        const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role });
        
        // Simpan refresh token baru ke database
        user.refreshToken = newRefreshToken;
        await user.save();
        
        // Set cookie baru untuk refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success : true,
            message : "Token refreshed successfully",
            data : {
                accessToken : newAccessToken
            }
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}