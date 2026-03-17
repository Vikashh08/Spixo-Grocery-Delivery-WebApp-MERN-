import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: "DELIVERY" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema);
