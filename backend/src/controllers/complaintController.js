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
    // === LOCAL STORAGE (comment when using Cloudinary) ===
    // const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    // === CLOUDINARY (uncomment when using Cloudinary) ===
    const imagePaths = req.files ? req.files.map(f => f.path) : [];
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
            image: imagePaths 
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
        // === CLOUDINARY (uncomment when using Cloudinary) ===
        if (imagePaths.length > 0) {
            for (const imgPath of imagePaths) {
                const public_id = getPublicIdFromUrl(imgPath);
                deleteCloudinaryImage(public_id);
            }
        }

        // === LOCAL STORAGE (comment when using Cloudinary) ===
        // if (imagePaths.length > 0) {
        //     const { removeFile } = await import("../utils/file.js");
        //     for (const imgPath of imagePaths) {
        //         await removeFile(imgPath);
        //     }
        // }
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateComplaint = async (req, res) => {
    // === LOCAL STORAGE (comment when using Cloudinary) ===
    // const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    // === CLOUDINARY (uncomment when using Cloudinary) ===
    const newImages = req.files ? req.files.map(f => f.path) : [];
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            // Cleanup uploaded images if validation fails
            if(newImages.length > 0){
                for (const img of newImages) {
                    const public_id = getPublicIdFromUrl(img);
                    deleteCloudinaryImage(public_id);
                }
            }
            return res.status(400).json({
                success : false,
                message : "Complaint id is invalid"
            });
        }
        
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            // Cleanup uploaded images if complaint not found
            if(newImages.length > 0){
                for (const img of newImages) {
                    const public_id = getPublicIdFromUrl(img);
                    deleteCloudinaryImage(public_id);
                }
            }
            return res.status(404).json({
                success : false,
                message : "Complaint not found"
            });
        }

        // === CLOUDINARY (uncomment when using Cloudinary) ===
        const oldImages = complaint.image || [];
        if (newImages.length > 0) {
            // Replace old images with new ones
            complaint.image = newImages;
        }
        Object.assign(complaint, req.body);
        await complaint.save();

        // Delete old images from Cloudinary after successful update
        if(newImages.length > 0 && oldImages.length > 0){
            for (const img of oldImages) {
                const public_id = getPublicIdFromUrl(img);
                deleteCloudinaryImage(public_id);
            }
        }
        // === LOCAL STORAGE (comment when using Cloudinary) ===
        // if (newImages.length > 0) {
        //     complaint.image = newImages;
        // }
        
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
        // Cleanup uploaded images on error
        if(newImages.length > 0){
            for (const img of newImages) {
                const public_id = getPublicIdFromUrl(img);
                deleteCloudinaryImage(public_id);
            }
        }
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
        if(complaint.image && complaint.image.length > 0){
            for (const img of complaint.image) {
                const public_id = getPublicIdFromUrl(img);
                deleteCloudinaryImage(public_id);
            }
        }

        // === LOCAL STORAGE (comment when using Cloudinary) ===
        // if(complaint.image && Array.isArray(complaint.image)){
        //     const { removeFile } = await import("../utils/file.js");
        //     for (const img of complaint.image) {
        //         await removeFile(img);
        //     }
        // } else if (complaint.image && typeof complaint.image === 'string') {
        //     const { removeFile } = await import("../utils/file.js");
        //     await removeFile(complaint.image);
        // }
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