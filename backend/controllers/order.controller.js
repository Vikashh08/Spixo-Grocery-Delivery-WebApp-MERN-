import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";

// ────── PLACE ORDER (user) ──────
export const placeOrder = async (req, res) => {
  try {
    const { items, address, deliverySlot } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get settings for delivery charge
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
    const totalAmount = subtotal + deliveryCharge;

    // Get user info for denormalization
    const user = await User.findById(req.user.id);

    const order = await Order.create({
      userId: req.user.id,
      items,
      address,
      subtotal,
      deliveryCharge,
      totalAmount,
      deliverySlot: deliverySlot || "FAST",
      userPhone: user?.phone || "",
      userName: user?.name || ""
    });

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
      // Recalculate isAvailable
      const prod = await Product.findById(item.productId);
      if (prod) {
        prod.isAvailable = prod.stock > 0;
        await prod.save();
      }
    }

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET MY ORDERS (user) ──────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── GET ALL ORDERS (admin) ──────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .populate("deliveryPartnerId", "name phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── CANCEL ORDER (user) ──────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (["PICKED", "ON_THE_WAY", "DELIVERED"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel order at this stage" });
    }

    order.status = "CANCELLED";
    await order.save();
    res.json({ message: "Order cancelled", order });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── ASSIGN ORDER TO DELIVERY PARTNER (admin) ──────
export const assignOrder = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryPartnerId = deliveryPartnerId;
    order.status = "ASSIGNED";
    await order.save();

    res.json({ message: "Order assigned", order });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ────── UPDATE ORDER STATUS (delivery partner) ──────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PICKED", "ON_THE_WAY", "DELIVERED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryPartnerId?.toString() !== req.deliveryId) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.status = status;
    if (status === "DELIVERED") order.deliveredAt = new Date();
    await order.save();

    res.json({ message: "Status updated", order });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
