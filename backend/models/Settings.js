import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  deliveryRadius: { type: Number, default: 5 },       // in km
  deliveryCharge: { type: Number, default: 35 },      // in ₹
  freeDeliveryThreshold: { type: Number, default: 500 }, // order amount for free delivery
  isStoreOpen: { type: Boolean, default: true },      // pause/resume store
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Settings", settingsSchema);
