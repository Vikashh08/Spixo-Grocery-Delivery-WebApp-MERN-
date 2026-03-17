import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner", default: null },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      unit: String
    }
  ],

  address: {
    label: String,
    house: String,
    street: String,
    landmark: String,
    area: String,
    pincode: String
  },

  // Denormalized for quick access by delivery partner
  userPhone: { type: String, default: "" },
  userName: { type: String, default: "" },

  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  paymentMethod: { type: String, default: "COD" },
  deliverySlot: { type: String, enum: ["FAST", "EVENING"], default: "FAST" },

  status: {
    type: String,
    enum: ["PLACED", "ASSIGNED", "PICKED", "ON_THE_WAY", "DELIVERED", "CANCELLED"],
    default: "PLACED"
  },

  createdAt: { type: Date, default: Date.now },
  deliveredAt: Date
});

export default mongoose.model("Order", orderSchema);
