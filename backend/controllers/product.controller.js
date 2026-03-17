import Product from "../models/Product.js";

// GET all products (public - filtered by isAvailable)
export const getAllProducts = async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (q) filter.name = { $regex: q, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET all products for admin (includes out-of-stock)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST add product (admin only)
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, unit, category, discount, image, minOrderQuantity, maxOrderQuantity } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const finalStock = stock ?? 0;
    const finalMaxOrderQuantity = maxOrderQuantity !== undefined ? maxOrderQuantity : 10;

    if (finalMaxOrderQuantity > finalStock) {
      return res.status(400).json({ message: "Max order quantity cannot exceed available stock" });
    }

    const product = new Product({
      name, description, price,
      stock: finalStock,
      unit: unit || "unit",
      category,
      discount: discount ?? 0,
      image: image || "",
      minOrderQuantity: minOrderQuantity ?? 1,
      maxOrderQuantity: finalMaxOrderQuantity,
    });

    await product.save();

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.error("Error in addProduct:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT edit product (admin only)
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Filter out restricted fields to prevent Mongoose errors
    const { _id, __v, createdAt, ...allowedUpdates } = updates;

    // Validation for edit
    const currentStock = allowedUpdates.stock !== undefined ? allowedUpdates.stock : product.stock;
    const currentMaxQuantity = allowedUpdates.maxOrderQuantity !== undefined ? allowedUpdates.maxOrderQuantity : product.maxOrderQuantity;

    if (currentMaxQuantity > currentStock) {
       return res.status(400).json({ message: "Max order quantity cannot exceed available stock" });
    }

    Object.assign(product, allowedUpdates);
    await product.save(); // triggers pre-save hook for isAvailable

    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("Error in editProduct:", err);
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    res.status(500).json({ message: "Server error" });
  }
};
