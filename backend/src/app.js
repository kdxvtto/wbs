import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import {globalRateLimiter} from "./middleware/rateLimiter.js";
import {corsMiddleware} from "./middleware/cors.js";
import {helmetMiddleware} from "./middleware/helmet.js";

// Hidden admin route imports
import { register, login } from "./controllers/authController.js";
import { validate } from "./middleware/validate.js";
import { registerAdminSchema, adminLoginSchema } from "./validations/authValidator.js";
import { loginRateLimiter, registerRateLimiter } from "./middleware/rateLimiter.js";

// import Routes
import activityLogRoutes from "./routes/activityLogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

const app = express();

// Health Check Endpoint - MUST be before all middleware for Railway health checks
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Trust proxy for Railway/Vercel (required for rate limiter to work correctly)
app.set("trust proxy", 1);

// Middleware - CORS must be FIRST before rate limiter
app.use(corsMiddleware);

app.use(express.json());
app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());
app.use(globalRateLimiter);
app.use(helmetMiddleware);

// Static files for uploads
app.use("/uploads", express.static(path.resolve(__dirname, "..", "public", "uploads")));

// Routes
app.use("/api/activity", activityLogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/response", responseRoutes);
app.use("/api/user", userRoutes);

// Hidden admin routes - path tersembunyi untuk akses admin
app.post("/api/hanomanbpr/register", registerRateLimiter, validate(registerAdminSchema), register);
app.post("/api/hanomanbpr/login", loginRateLimiter, validate(adminLoginSchema), login);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app;