import express from "express";
import { protect, allow } from "../middleware/auth.middleware.js";
import adminAuth from "../middleware/adminAuth.middleware.js";
import deliveryAuth from "../middleware/deliveryAuth.middleware.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  cancelOrder,
  assignOrder,
  updateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

// User routes
router.post("/", protect, allow("USER"), placeOrder);
router.get("/my", protect, allow("USER"), getMyOrders);
router.post("/cancel/:id", protect, allow("USER"), cancelOrder);

// Admin routes
router.get("/", adminAuth, getAllOrders);
router.put("/:id/assign", adminAuth, assignOrder);

// Delivery partner routes
router.put("/:id/status", deliveryAuth, updateOrderStatus);

export default router;
