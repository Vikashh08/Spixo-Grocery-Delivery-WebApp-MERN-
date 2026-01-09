import express from "express";
import { deliveryLogin, createDeliveryPartner } from "../controllers/delivery.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";
import { getAssignedOrders } from "../controllers/delivery.controller.js";
import deliveryAuth from "../middleware/deliveryAuth.middleware.js";
import { getAllDeliveryPartners } from "../controllers/delivery.controller.js";





const router = express.Router();

router.post("/login", deliveryLogin);
router.post("/create", adminAuth, createDeliveryPartner);
router.get("/orders", deliveryAuth, getAssignedOrders);
router.get("/", adminAuth, getAllDeliveryPartners);
export default router;
