import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, default: "Admin" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "ADMIN" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Admin", adminSchema);
