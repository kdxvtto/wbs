import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema, updateCategorySchema } from "../validations/categoryValidator.js";
import { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();    

// Category Routes
router.get("/", verifyToken, checkRole(["Admin", "Pimpinan", "Staf", "Nasabah"]), getAllCategory);
router.get("/:id", verifyToken, checkRole(["Admin", "Pimpinan", "Staf", "Nasabah"]), getCategoryById);
router.post("/", verifyToken, checkRole(["Admin"]), validate(createCategorySchema), createCategory);
router.put("/:id", verifyToken, checkRole(["Admin"]), validate(updateCategorySchema), updateCategory);
router.delete("/:id", verifyToken, checkRole(["Admin"]), deleteCategory);

export default router;