const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs"); // uncomment if using password hashing

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password, role }); // use hashedPassword if hashing
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET);
    res.json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user /* || !(await bcrypt.compare(password, user.password)) */ || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
