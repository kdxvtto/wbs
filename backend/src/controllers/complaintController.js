import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import { deleteCloudinaryImage, getPublicIdFromUrl } from "../config/cloudinary.js";
import { createActivityLog } from "./activityLogController.js";

export const getAllComplaint = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const complaint = await Complaint.find()
            .populate('category', 'name')
            .populate('user', 'name email')
            .sort({ createdAt : -1 })
            .skip(skip)
            .limit(limit);
        const totalComplaint = await Complaint.countDocuments();
        const totalPages = Math.ceil(totalComplaint / limit);
        res.status(200).json({
            success : true,
            message : "Complaint fetched successfully",
            data : complaint,
            totalComplaint,
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

export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Complaint id is invalid"
            });
        }
        const complaint = await Complaint.findById(id)
            .populate('category', 'name')
            .populate('user', 'name email');
        if (!complaint) {
            return res.status(404).json({
                success : false,
                message : "Complaint not found"
            });
        }
        res.status(200).json({
            success : true,
            message : "Complaint fetched successfully",
            data : complaint
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const createComplaint = async (req, res) => {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const { category, location, condition, description } = req.body;
        if (!category || !location || !condition || !description) {
            return res.status(400).json({
                success : false,
                message : "Category, location, condition and description are required"
            });
        }
        const complaint = await Complaint.create({ 
            user : req.user._id, 
            category, 
            location, 
            condition, 
            description, 
            image: imagePath ? [imagePath] : [] 
        });
        
        // Log activity
        await createActivityLog({
            action: 'create',
            resource: 'complaint',
            resourceName: description.substring(0, 50),
            resourceId: complaint._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(201).json({
            success : true,
            message : "Complaint created successfully",
            data : complaint
        });
    } catch (error) {
        console.error("Create Complaint Error:", error);
        if (image) {
            const public_id = getPublicIdFromUrl(image);
            deleteCloudinaryImage(public_id);
        }
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateComplaint = async (req, res) => {
    const newImage = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Complaint id is invalid"
            });
        }
        
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({
                success : false,
                message : "Complaint not found"
            });
        }

        // Update fields from request body
        const { category, location, condition, description, status } = req.body;
        if (category) complaint.category = category;
        if (location) complaint.location = location;
        if (condition) complaint.condition = condition;
        if (description) complaint.description = description;
        if (status) complaint.status = status;
        if (newImage) {
            complaint.image = complaint.image || [];
            complaint.image.push(newImage);
        }

        await complaint.save();
        
        // Log activity
        await createActivityLog({
            action: 'update',
            resource: 'complaint',
            resourceName: complaint.description?.substring(0, 50) || 'Complaint',
            resourceId: complaint._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(200).json({
            success : true,
            message : "Complaint updated successfully",
            data : complaint
        });
    } catch (error) {
        console.error('Update Complaint Error:', error);
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Complaint id is invalid"
            });
        }
        const complaint = await Complaint.findByIdAndDelete(id);
        if (!complaint) {
            return res.status(404).json({
                success : false,
                message : "Complaint not found"
            });
        }
        // === CLOUDINARY (uncomment when using Cloudinary) ===
        // if(complaint.image){
        //     const public_id = getPublicIdFromUrl(complaint.image);
        //     deleteCloudinaryImage(public_id);
        // }

        // === LOCAL STORAGE (comment when using Cloudinary) ===
        if(complaint.image && Array.isArray(complaint.image)){
            const { removeFile } = await import("../utils/file.js");
            for (const img of complaint.image) {
                await removeFile(img);
            }
        } else if (complaint.image && typeof complaint.image === 'string') {
            const { removeFile } = await import("../utils/file.js");
            await removeFile(complaint.image);
        }
        // Log activity
        await createActivityLog({
            action: 'delete',
            resource: 'complaint',
            resourceName: complaint.description?.substring(0, 50) || 'Complaint',
            resourceId: complaint._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(200).json({
            success : true,
            message : "Complaint deleted successfully",
            data : complaint
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}