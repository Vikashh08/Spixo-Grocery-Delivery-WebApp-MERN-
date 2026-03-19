import express from "express";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/contact - Public submission (can include userId if logged in)
router.post("/", async (req, res) => {
  try {
    const { name, email, message, reason, userId } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Essential fields missing." });
    }

    const newMessage = new Contact({ 
      userId: userId || null, 
      name, 
      email, 
      message, 
      reason 
    });
    await newMessage.save();

    res.status(200).json({ message: "Message received. Our support team will reach out shortly." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Network error. Please try again later." });
  }
});

// GET /api/contact/my - Get current user's inquiries
router.get("/my", protect, async (req, res) => {
  try {
    const messages = await Contact.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your inquiries" });
  }
});

// GET /api/contact - Admin only
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// PUT /api/contact/:id - Update status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// DELETE /api/contact/:id - Delete message
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

export default router;
