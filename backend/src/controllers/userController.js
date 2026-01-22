import User from "../models/User.js";
import mongoose from "mongoose";

export const getAllUser = async (req, res) => {
    try {
        // Digunakan untuk pagination
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        // Digunakan untuk mengambil data user
        const user = await User.find().sort({ createdAt: -1 }).select("-password").skip(skip).limit(limit);
        const totalUser = await User.countDocuments();
        const totalPages = Math.ceil(totalUser / limit);
        res.status(200).json({ 
            success : true,
            message : "User fetched successfully",
            data : user,
            totalUser,
            totalPages,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "User id is invalid"
            });
        }
        // Digunakan untuk mengambil data user berdasarkan id dan mengecualikan password
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        res.status(200).json({
            success : true,
            message : "User fetched successfully",
            data : user
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const createUser = async (req, res) => {
    try {
        const { nik, name, username, email, password, phone, role } = req.body;
        if(role === "Admin" || role === "Pimpinan" || role === "Staf"){
            if( !name || !username || !password){
                return res.status(400).json({
                    success : false,
                    message : "Name, username and password are required for Admin, Pimpinan and Staf"
                });
            }
            // Admin, Pimpinan, Staf tidak boleh punya email, nik, dan phone
            if (email || nik || phone) {
                return res.status(400).json({
                    success : false,
                    message : "Admin, Pimpinan and Staf cannot have email, NIK, or phone"
                });
            }
        }
        if(role === "Nasabah"){
            if (!nik || !name || !email || !password || !phone) {
                return res.status(400).json({
                    success : false,
                    message : "NIK, name, email, password and phone are required for Nasabah"
                });
            }
            // Nasabah tidak boleh punya username
            if (username) {
                return res.status(400).json({
                    success : false,
                    message : "Nasabah cannot have username"
                });
            }
        }
        const existingUser = await User.findOne({
            // Jika username atau email sudah ada, maka tidak boleh membuat user baru
            $or : [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
            ]
        });
        if (existingUser) {
            return res.status(400).json({
                success : false,
                message : "User already exists"
            });
        }
        const user = await User.create({
            nik,
            name,
            username : username || undefined,
            email : email || undefined,
            password, 
            role, 
            phone
            });
        // Mengubah user menjadi object dan menghapus password
        const safeUser = user.toObject();
        delete safeUser.password;
        res.status(201).json({
            success : true,
            message : "User created successfully",
            data : safeUser
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "User id is invalid"
            });
        }
        const findUser = await User.findOne({
            $or : [
                ...(req.body.username ? [{ username : req.body.username }] : []),
                ...(req.body.email ? [{ email : req.body.email }] : [])
            ],
            _id : {$ne : id}
        });
        if (findUser) {
            return res.status(400).json({
                success : false,
                message : "User already exists"
            });
        }
        const user = await User.findByIdAndUpdate(id, req.body, { new : true }).select("-password");
        if (!user) {
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        res.status(200).json({
            success : true,
            message : "User updated successfully",
            data : user
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "User id is invalid"
            });
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        res.status(200).json({
            success : true,
            message : "User deleted successfully",
            data : user
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}
