import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProfile, updateProfile, addAddress } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/address", protect, addAddress);

export default router;
