import express from "express";
import {
  deliveryLogin,
  createDeliveryPartner,
  getAllDeliveryPartners,
  getAssignedOrders,
  getOrderHistory,
  getDeliveryMe,
  toggleDeliveryPartner
} from "../controllers/delivery.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";
import deliveryAuth from "../middleware/deliveryAuth.middleware.js";

const router = express.Router();

router.post("/login", deliveryLogin);
router.get("/me", deliveryAuth, getDeliveryMe);
router.get("/orders", deliveryAuth, getAssignedOrders);
router.get("/history", deliveryAuth, getOrderHistory);

// Admin only
router.post("/create", adminAuth, createDeliveryPartner);
router.get("/", adminAuth, getAllDeliveryPartners);
router.put("/:id/toggle", adminAuth, toggleDeliveryPartner);

export default router;
