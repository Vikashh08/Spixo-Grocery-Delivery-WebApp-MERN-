import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import crypto from "crypto";

// ────── USER REGISTRATION ──────
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      addresses: address ? [address] : []
    });

    const token = jwt.sign(
      { id: user._id, role: "USER" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: "USER" }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── USER LOGIN ──────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GOOGLE OAUTH CALLBACK ──────
// Called by Passport after Google auth succeeds
export const googleCallback = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: "Google auth data missing" });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({ name, email, googleId, role: "USER" });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── ADMIN LOGIN ──────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: "ADMIN" }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET CURRENT USER ──────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// ────── RESET PASSWORD ──────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real app, send email here. For now, returned mocked success.
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ 
      message: "We've sent a password reset link to your email address.",
      mockToken: resetToken // Returning token for easy testing in this dev environment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong on our end" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Your password has been successfully updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during password reset" });
  }
};
