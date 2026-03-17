import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;

    await user.save();
    res.json({ message: "Profile updated", user: { id: user._id, name: user.name, phone: user.phone, addresses: user.addresses } });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add address
router.post("/address", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
