// resetAdminPassword.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function resetPassword() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const result = await User.findOneAndUpdate(
    { email: "admin@smartcook.com" },
    { password: hashedPassword }
  );

  if (result) {
    console.log("✅ Admin password updated to 'admin123'");
  } else {
    console.log("❌ Admin user not found");
  }

  await mongoose.disconnect();
}

resetPassword().catch((err) => {
  console.error("❌ Error resetting password:", err);
});
