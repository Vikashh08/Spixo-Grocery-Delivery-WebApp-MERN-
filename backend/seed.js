// seed.js — Run once to seed admin account
// Usage: node seed.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import Admin from "./models/Admin.js";

await mongoose.connect(process.env.MONGO_URI);

const email = "admin@spixo.com";
const password = "Admin@123";

const existing = await Admin.findOne({ email });
if (existing) {
  console.log("Admin already exists:", email);
} else {
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Spixo Admin", email, password: hashed });
  console.log("✅ Admin created:", email, "| Password:", password);
}

mongoose.disconnect();
