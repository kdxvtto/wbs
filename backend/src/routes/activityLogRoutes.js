import express from "express";
import { getActivityLogs } from "../controllers/activityLogController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get recent activity logs (protected)
router.get("/", verifyToken, getActivityLogs);

export default router;
