import jwt from "jsonwebtoken";
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import DeliveryPartner from "../models/DeliveryPartner.js";

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// SEND OTP
export const sendOTP = async (req, res) => {
  const { identifier, role } = req.body;

  if (!identifier || !role) {
    return res.status(400).json({ message: "Identifier & role required" });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.findOneAndDelete({ identifier });

  await OTP.create({ identifier, otp, expiresAt });

  // TODO: integrate email / SMS provider
  console.log("OTP:", otp);

  res.json({ message: "OTP sent successfully" });
};

// VERIFY OTP & LOGIN
export const verifyOTP = async (req, res) => {
  const { identifier, otp, role } = req.body;

  const record = await OTP.findOne({ identifier });

  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  let user;

  if (role === "USER") {
    user = await User.findOne({ email: identifier });
    if (!user) user = await User.create({ email: identifier, role: "USER" });
  }

  if (role === "ADMIN") {
    user = await Admin.findOne({ email: identifier });
    if (!user) return res.status(403).json({ message: "Admin not allowed" });
  }

  if (role === "DELIVERY") {
    user = await DeliveryPartner.findOne({ email: identifier, isActive: true });
    if (!user) return res.status(403).json({ message: "Access denied" });
  }

  await OTP.deleteOne({ identifier });

  const token = jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user._id, role }
  });
};
