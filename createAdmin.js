// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = new User({
    username: "admin",
    email: "admin@smartcook.com",
    password: hashedPassword,
    role: "admin"
  });

  await adminUser.save();
  console.log("✅ Admin user created successfully!");
  mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("❌ Error creating admin:", err);
});
