import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  role: { type: String, default: "DELIVERY" },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("DeliveryPartner", deliverySchema);
