import DeliveryPartner from "../models/DeliveryPartner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      { deliveryId: partner._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


export const createDeliveryPartner = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await DeliveryPartner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Delivery partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DeliveryPartner.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Delivery partner created successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
import Order from "../models/Order.js";

export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: req.deliveryId,
      status: { $in: ["ASSIGNED", "PICKED", "ON_THE_WAY"] },
    }).populate("userId", "name phone address");

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ isActive: true }).select("_id name");
    res.json(partners);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
