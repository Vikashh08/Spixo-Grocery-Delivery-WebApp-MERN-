import express from "express";
import {
  adminLogin,
  getDashboardStats,
  getSettings,
  updateSettings,
  getAllUsers,
  getUserOrders,
  getStoreStatus
} from "../controllers/admin.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/store-status", getStoreStatus); // Public
router.get("/settings/public", getSettings); // Publicly accessible but controlled by getSettings
router.get("/dashboard", adminAuth, getDashboardStats);
router.get("/settings", adminAuth, getSettings);
router.put("/settings", adminAuth, updateSettings);
router.get("/users", adminAuth, getAllUsers);
router.get("/users/:id/orders", adminAuth, getUserOrders);

export default router;
