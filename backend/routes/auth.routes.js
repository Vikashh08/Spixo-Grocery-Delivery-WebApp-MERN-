import express from "express";
import { register, login, googleCallback, getMe, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleCallback);  // Google OAuth token exchange
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

export default router;
