import express from "express";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message, reason } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Essential fields missing." });
    }

    // Since we don't have a model yet, we'll just log it for now
    console.log(`📩 New Message from ${name} (${email}):`, { reason, message });
    
    // Simulate some processing delay
    setTimeout(() => {
      res.status(200).json({ message: "Message received. Our support team will reach out shortly." });
    }, 500);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Network error. Please try again later." });
  }
});

export default router;
