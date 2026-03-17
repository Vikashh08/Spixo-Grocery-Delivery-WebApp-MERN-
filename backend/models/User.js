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
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: String,          // null for Google-only accounts
  googleId: String,          // null for email/password accounts

  role: { type: String, default: "USER" },

  addresses: [addressSchema],
  
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
