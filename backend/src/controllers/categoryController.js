import mongoose from "mongoose";
import Category from "../models/Category.js";
import { createActivityLog } from "./activityLogController.js";

export const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find().sort({ createdAt : -1 });
        res.status(200).json({
            success : true,
            message : "Category fetched successfully",
            data : category
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Category id is invalid"
            });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success : false,
                message : "Category not found"
            });
        }
        res.status(200).json({
            success : true,
            message : "Category fetched successfully",
            data : category
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success : false,
                message : "Category name is required"
            });
        }
        const category = await Category.create({ name });
        
        // Log activity
        await createActivityLog({
            action: 'create',
            resource: 'category',
            resourceName: name,
            resourceId: category._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(201).json({
            success : true,
            message : "Category created successfully",
            data : category
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Category id is invalid"
            });
        }
        const existingCategory = await Category.findOne({ name : req.body.name, _id : {$ne : id}});
        if (existingCategory) {
            return res.status(400).json({
                success : false,
                message : "Category already exists"
            });
        }
        const category = await Category.findByIdAndUpdate(id, req.body, { new : true });
        if (!category) {
            return res.status(404).json({
                success : false,
                message : "Category not found"
            });
        }
        
        // Log activity
        await createActivityLog({
            action: 'update',
            resource: 'category',
            resourceName: category.name,
            resourceId: category._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(200).json({
            success : true,
            message : "Category updated successfully",
            data : category
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Category id is invalid"
            });
        }
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                success : false,
                message : "Category not found"
            });
        }
        
        // Log activity
        await createActivityLog({
            action: 'delete',
            resource: 'category',
            resourceName: category.name,
            resourceId: category._id,
            userId: req.user._id,
            userName: req.user.name || req.user.username
        });
        
        res.status(200).json({
            success : true,
            message : "Category deleted successfully",
            data : category
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}
