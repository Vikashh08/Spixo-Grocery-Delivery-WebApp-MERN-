import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, enum: ["unit", "kg", "litre", "pack", "dozen"], default: "unit" },
  unitQuantity: { type: String, default: "" },
  category: { type: String, required: true },
  discount: { type: Number, default: 0 },
  image: { type: String, default: "" },
  minOrderQuantity: { type: Number, default: 1 },
  maxOrderQuantity: { type: Number, default: 10 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// auto-update isAvailable based on stock
productSchema.pre("save", function () {
  this.isAvailable = this.stock > 0;
});

export default mongoose.model("Product", productSchema);
