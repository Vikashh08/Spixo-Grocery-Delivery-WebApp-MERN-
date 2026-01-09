import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const order = await Order.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId deliveryPartnerId");
  res.json(orders);
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order.status === "PICKED" || order.status === "ON_THE_WAY")
    return res.status(400).json({ message: "Too late to cancel" });

  order.status = "CANCELLED";
  await order.save();
  res.json(order);
};
