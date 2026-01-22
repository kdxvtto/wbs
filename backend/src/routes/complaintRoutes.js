import express from "express";
import { getAllComplaint, getComplaintById, createComplaint, updateComplaint, deleteComplaint } from "../controllers/complaintController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import { createComplaintSchema, updateComplaintSchema } from "../validations/complaintValidator.js";
// import { complaintUpload } from "../config/cloudinary.js";
import { upload } from "../middleware/upload.js"; // Pakai local storage dulu


const router = express.Router();

// Complaint Routes
router.get("/", verifyToken, checkRole(["Admin", "Pimpinan", "Staf", "Nasabah"]), getAllComplaint);
router.get("/:id", verifyToken, checkRole(["Admin", "Pimpinan", "Staf", "Nasabah"]), getComplaintById);
router.post("/", verifyToken, checkRole(["Nasabah"]), upload.single("image"), validate(createComplaintSchema), createComplaint);
router.put("/:id", verifyToken, checkRole(["Admin"]), upload.single("image"), validate(updateComplaintSchema), updateComplaint);
router.delete("/:id", verifyToken, checkRole(["Admin"]), deleteComplaint);

export default router;