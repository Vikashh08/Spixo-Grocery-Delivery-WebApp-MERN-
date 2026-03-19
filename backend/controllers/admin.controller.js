import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Settings from "../models/Settings.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import { io } from "../server.js";

// ────── ADMIN LOGIN ──────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

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

// ────── DASHBOARD STATS ──────
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: "DELIVERED" });
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["PLACED", "ASSIGNED", "PICKED", "ON_THE_WAY"] }
    });
    const cancelledOrders = await Order.countDocuments({ status: "CANCELLED" });

    const revenueData = await Order.aggregate([
      { $match: { status: "DELIVERED" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const revenue = revenueData[0]?.total || 0;

    const totalUsers = await User.countDocuments();
    
    // Calculate top selling products (by volume) with images and current info
    const topProducts = await Order.aggregate([
      { $match: { status: "DELIVERED" } },
      { $unwind: "$items" },
      { $group: { 
          _id: "$items.productId", 
          name: { $first: "$items.name" }, 
          count: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $addFields: {
          image: { $arrayElemAt: ["$productDetails.image", 0] },
          category: { $arrayElemAt: ["$productDetails.category", 0] },
          price: { $arrayElemAt: ["$productDetails.price", 0] }
        }
      },
      { $project: { productDetails: 0 } }
    ]);

    // Calculate 7-day revenue trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueTrend = await Order.aggregate([
      { 
        $match: { 
          status: "DELIVERED",
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          rev: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map to days of week for the chart
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = revenueTrend.find(r => r._id === dateStr);
      chartData.push({
        name: days[d.getDay()],
        rev: match ? match.rev : 0
      });
    }

    const recentOrders = await Order.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ 
      totalOrders, 
      deliveredOrders, 
      pendingOrders, 
      cancelledOrders, 
      revenue, 
      recentOrders, 
      totalUsers, 
      topProducts,
      chartData // Real data for the chart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET SETTINGS ──────
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── UPDATE SETTINGS ──────
export const updateSettings = async (req, res) => {
  try {
    const { deliveryRadius, deliveryCharge, freeDeliveryThreshold, isStoreOpen } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (deliveryRadius !== undefined) settings.deliveryRadius = deliveryRadius;
    if (deliveryCharge !== undefined) settings.deliveryCharge = deliveryCharge;
    if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = freeDeliveryThreshold;
    if (isStoreOpen !== undefined) settings.isStoreOpen = isStoreOpen;
    settings.updatedAt = new Date();
    await settings.save();

    io.emit("settings_updated", settings);

    res.json({ message: "Settings updated", settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET STORE STATUS (PUBLIC) ──────
export const getStoreStatus = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ isStoreOpen: settings?.isStoreOpen ?? true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET ALL USERS ──────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
// ────── GET USER ORDERS ──────
export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
