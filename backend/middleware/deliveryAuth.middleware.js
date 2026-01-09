import jwt from "jsonwebtoken";

const deliveryAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.deliveryId = decoded.deliveryId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default deliveryAuth;
