import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  house: String,
  street: String,
  landmark: String,
  area: String,
  pincode: String,
  lat: Number,
  lng: Number
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,

  role: { type: String, default: "USER" },

  addresses: [addressSchema],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
