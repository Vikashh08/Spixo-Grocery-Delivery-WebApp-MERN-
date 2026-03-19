import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  reason: { type: String, default: "General Inquiry" },
  status: { type: String, enum: ["PENDING", "RESOLVED", "SPAM"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Contact", contactSchema);
