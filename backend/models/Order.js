import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },

  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number
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

  totalAmount: Number,
  deliveryCharge: Number,
  paymentMethod: { type: String, default: "COD" },

  status: {
    type: String,
    enum: ["PLACED", "ASSIGNED", "PICKED", "ON_THE_WAY", "DELIVERED", "CANCELLED"],
    default: "PLACED"
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
