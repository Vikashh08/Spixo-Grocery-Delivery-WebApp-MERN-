import express from "express";
import {
  getAllProducts,
  getAllProductsAdmin,
  addProduct,
  editProduct,
  deleteProduct,
  getProductById
} from "../controllers/product.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/admin", adminAuth, getAllProductsAdmin);
router.get("/:id", getProductById); 
router.post("/", adminAuth, addProduct);
router.put("/:id", adminAuth, editProduct);
router.delete("/:id", adminAuth, deleteProduct);

export default router;
