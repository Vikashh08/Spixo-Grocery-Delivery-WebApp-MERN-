import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, quantity, unit, category } = req.body;

    if (!name || !price || !quantity || !unit || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const product = await Product.create({
      name,
      price,
      quantity,
      unit,
      category,
      isAvailable: quantity > 0,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
