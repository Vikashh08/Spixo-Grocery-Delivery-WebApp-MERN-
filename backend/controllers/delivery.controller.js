import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";

// ────── DELIVERY LOGIN ──────
export const deliveryLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const partner = await DeliveryPartner.findOne({ email });
    if (!partner || !partner.isActive) {
      return res.status(401).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { deliveryId: partner._id, role: "DELIVERY" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      partner: { id: partner._id, name: partner.name, email: partner.email, role: "DELIVERY" }
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── CREATE DELIVERY PARTNER (admin) ──────
export const createDeliveryPartner = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password required" });
    }

    const existing = await DeliveryPartner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Delivery partner already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const partner = await DeliveryPartner.create({ name, email, phone, password: hashed });

    res.status(201).json({ message: "Delivery partner created", partner: { id: partner._id, name: partner.name, email: partner.email } });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET ALL DELIVERY PARTNERS (admin) ──────
export const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ isActive: true }).select("-password");
    res.json(partners);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET ASSIGNED ORDERS (delivery partner) ──────
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: req.deliveryId,
      status: { $in: ["ASSIGNED", "PICKED", "ON_THE_WAY"] }
    }).populate("userId", "name phone address").sort({ createdAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET ORDER HISTORY (delivery partner) ──────
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: req.deliveryId,
      status: "DELIVERED"
    }).populate("userId", "name phone address").sort({ deliveredAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET DELIVERY PARTNER ME ──────
export const getDeliveryMe = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.deliveryId).select("-password");
    if (!partner) return res.status(404).json({ message: "Not found" });
    res.json(partner);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── TOGGLE ACTIVE STATUS (admin) ──────
export const toggleDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Not found" });

    partner.isActive = !partner.isActive;
    await partner.save();

    res.json({ message: "Status updated", isActive: partner.isActive });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
