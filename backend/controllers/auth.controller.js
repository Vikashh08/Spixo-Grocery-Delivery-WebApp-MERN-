import jwt from "jsonwebtoken";
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import DeliveryPartner from "../models/DeliveryPartner.js";

const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (req, res) => {
  const { identifier, role } = req.body;
  const otp = genOTP();

  await OTP.findOneAndDelete({ identifier });
  await OTP.create({
    identifier,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  console.log("OTP:", otp);
  res.json({ message: "OTP sent" });
};

export const verifyOTP = async (req, res) => {
  const { identifier, otp, role } = req.body;

  const record = await OTP.findOne({ identifier });
  if (!record || record.otp !== otp || record.expiresAt < Date.now())
    return res.status(400).json({ message: "Invalid OTP" });

  let user;

  if (role === "USER") {
    user = await User.findOne({ email: identifier }) ||
           await User.create({ email: identifier });
  }

  if (role === "ADMIN") {
    user = await Admin.findOne({ email: identifier });
    if (!user) return res.status(403).json({ message: "Admin denied" });
  }

  if (role === "DELIVERY") {
    user = await DeliveryPartner.findOne({ email: identifier, isActive: true });
    if (!user) return res.status(403).json({ message: "Delivery denied" });
  }

  await OTP.deleteOne({ identifier });

  const token = jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};
