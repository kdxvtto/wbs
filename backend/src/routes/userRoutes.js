import express from "express";
import { getAllUser, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, updateUserSchema } from "../validations/userValidator.js";

const router = express.Router();

// User Routes
router.get("/", verifyToken, checkRole(["Admin"]), getAllUser);
router.get("/:id", verifyToken, checkRole(["Admin"]), getUserById);
router.post("/", verifyToken, checkRole(["Admin"]), validate(createUserSchema), createUser);
router.put("/:id", verifyToken, checkRole(["Admin"]), validate(updateUserSchema), updateUser);
router.delete("/:id", verifyToken, checkRole(["Admin"]), deleteUser);

export default router;
