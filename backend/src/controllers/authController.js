import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import { blacklistToken } from "../utils/blacklistToken.js";


export const register = async (req, res) => {
    try {
        const { nik, name, username, email, password, phone, role } = req.body;
        
        // Check for existing user with same unique fields
        const existingUser = await User.findOne({
            $or: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : []),
                ...(nik ? [{ nik }] : []),
                ...(phone ? [{ phone }] : [])
            ]
        });
        
        if (existingUser) {
            let duplicateField = '';
            if (username && existingUser.username === username) duplicateField = 'Username';
            else if (email && existingUser.email === email) duplicateField = 'Email';
            else if (nik && existingUser.nik === nik) duplicateField = 'NIK';
            else if (phone && existingUser.phone === phone) duplicateField = 'Phone number';
            return res.status(400).json({
                success: false,
                message: `${duplicateField} already exists`
            });
        }
        
        // Create user - Model handles default role ("Nasabah") and password hashing
        const user = await User.create({
            nik,
            name,
            username: username || undefined,
            email: email || undefined,
            password,
            role,
            phone
        });
        
        const safeUser = user.toObject();
        delete safeUser.password;
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user: safeUser }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!password){
            return res.status(400).json({
                success : false,
                message : "Password is required"
            });
        }
        const user = await User.findOne({
            $or : [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
            ]
        });
        if (!user) {
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success : false,
                message : "Invalid password"
            });
        }
        const payload = {
            id : user._id,
            role : user.role
        }
        const token = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            secure : true,
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.refreshToken;

        res.status(200).json({
            success : true,
            message : "User logged in successfully",
            data : {
                user : safeUser,
                token,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const logout = async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            });
        }
        blacklistToken(token)
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            await User.updateOne({ refreshToken : refreshToken }, { refreshToken : null });
        }
        res.clearCookie("refreshToken", {
            httpOnly : true,
            secure : true,
            sameSite : "strict"
        })
        
        res.status(200).json({
            success : true,
            message : "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Set password langsung - Model pre-save hook akan handle hashing
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};