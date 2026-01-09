import express from "express";
import { getAllProducts, addProduct } from "../controllers/product.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", adminAuth, addProduct);

export default router;
