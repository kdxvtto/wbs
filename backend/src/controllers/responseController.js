import mongoose from "mongoose";
import Response from "../models/Response.js";
import { createActivityLog } from "./activityLogController.js";

export const getAllResponse = async (req, res) => {
    try {
        const { idComplaint } = req.query;
        const filter = idComplaint ? { idComplaint } : {};
        const response = await Response.find(filter)
            .populate('idUser', 'name')
            .populate('idComplaint', 'description status location')
            .sort({ createdAt : -1 });
        res.status(200).json({
            success : true,
            message : "Response fetched successfully",
            data : response
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const getResponseById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Response id is invalid"
            });
        }
        const response = await Response.findById(id);
        if (!response) {
            return res.status(404).json({
                success : false,
                message : "Response not found"
            });
        }
        res.status(200).json({
            success : true,
            message : "Response fetched successfully",
            data : response
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}
// === SEBELUMNYA (SALAH - mengambil id dari params padahal route tidak punya :id) ===
// export const createResponse = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if(!mongoose.Types.ObjectId.isValid(id)){
//             return res.status(400).json({
//                 success : false,
//                 message : "Response id is invalid"
//             });
//         }
//         const response = await Response.create({ idComplaint : id, idUser : req.user._id, ...req.body });
//         ...
//     }
// }

// === SEKARANG (BENAR - mengambil idComplaint dari body) ===
export const createResponse = async (req, res) => {
    try {
        const { idComplaint, status, progress, response: responseText } = req.body;
        if(!mongoose.Types.ObjectId.isValid(idComplaint)){
            return res.status(400).json({
                success : false,
                message : "Complaint id is invalid"
            });
        }
        const newResponse = await Response.create({ 
            idComplaint, 
            idUser : req.user._id, 
            status, 
            progress, 
            response: responseText 
        });
        
        // Log activity
        await createActivityLog({
            action: 'create',
            resource: 'response',
            resourceName: responseText?.substring(0, 50) || 'Response',
            resourceId: newResponse._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(201).json({
            success : true,
            message : "Response created successfully",
            data : newResponse
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateResponse = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Response id is invalid"
            });
        }
        const response = await Response.findByIdAndUpdate(id, req.body, { new : true });
        if (!response) {
            return res.status(404).json({
                success : false,
                message : "Response not found"
            });
        }
        
        // Log activity
        await createActivityLog({
            action: 'update',
            resource: 'response',
            resourceName: response.response?.substring(0, 50) || 'Response',
            resourceId: response._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(200).json({
            success : true,
            message : "Response updated successfully",
            data : response
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const deleteResponse = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Response id is invalid"
            });
        }
        const response = await Response.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({
                success : false,
                message : "Response not found"
            });
        }
        
        // Log activity
        await createActivityLog({
            action: 'delete',
            resource: 'response',
            resourceName: response.response?.substring(0, 50) || 'Response',
            resourceId: response._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(200).json({
            success : true,
            message : "Response deleted successfully",
            data : response
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}