import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allow } from "../middleware/role.middleware.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  cancelOrder
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, allow("USER"), placeOrder);
router.get("/my", protect, allow("USER"), getMyOrders);
router.get("/", protect, allow("ADMIN"), getAllOrders);
router.post("/cancel/:id", protect, allow("USER"), cancelOrder);

export default router;
