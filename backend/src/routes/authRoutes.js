import express from "express";
import { register, login, logout, getProfile, updateProfile, changePassword } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerUserSchema, registerAdminSchema, adminLoginSchema, userLoginSchema, changePasswordSchema   } from "../validations/authValidator.js";
import { loginRateLimiter, registerRateLimiter, changePasswordRateLimiter,  } from "../middleware/rateLimiter.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshTokenController.js";


const router = express.Router();

// Auth Routes

router.post("/register/admin", registerRateLimiter, validate(registerAdminSchema), register);
router.post("/register/user", registerRateLimiter, validate(registerUserSchema), register);
router.post("/login/admin", loginRateLimiter, validate(adminLoginSchema), login);
router.post("/login/user", loginRateLimiter, validate(userLoginSchema), login);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePasswordRateLimiter, validate(changePasswordSchema), changePassword);
router.post("/refresh-token", refreshToken);

export default router;