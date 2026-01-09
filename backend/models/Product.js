import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  unit: { type: String, enum: ["unit", "kg"] },
  category: String,
  discount: { type: Number, default: 0 },
  image: String,
  isAvailable: { type: Boolean, default: true }
});

export default mongoose.model("Product", productSchema);
