import express from "express";
import { getAllResponse, getResponseById, createResponse, updateResponse, deleteResponse } from "../controllers/responseController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import { createResponseSchema, updateResponseSchema } from "../validations/responseValidator.js";

const router = express.Router();

// Response Routes
router.get("/", verifyToken, checkRole(["Admin", "Pimpinan", "Staf", "Nasabah"]), getAllResponse);
router.get("/:id", verifyToken, checkRole(["Admin", "Pimpinan", "Staf", "Nasabah"]), getResponseById);
router.post("/", verifyToken, checkRole(["Admin", "Pimpinan", "Staf"]), validate(createResponseSchema), createResponse);
router.put("/:id", verifyToken, checkRole(["Admin", "Pimpinan", "Staf"]), validate(updateResponseSchema), updateResponse);
router.delete("/:id", verifyToken, checkRole(["Admin", "Pimpinan", "Staf"]), deleteResponse);

export default router;
