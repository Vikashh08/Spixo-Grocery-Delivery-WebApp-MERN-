import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  role: { type: String, default: "ADMIN" }
});

export default mongoose.model("Admin", adminSchema);
