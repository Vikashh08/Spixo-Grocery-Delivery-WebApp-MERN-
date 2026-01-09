import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  identifier: String,
  otp: String,
  expiresAt: Date
});

export default mongoose.model("OTP", otpSchema);
