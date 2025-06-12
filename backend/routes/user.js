const express = require("express");
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/doctors", authenticate, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name email");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;