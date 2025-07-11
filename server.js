const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Allow both local and Vercel frontend to connect
const corsOptions = {
  origin: ["http://localhost:3000", "https://smartcook-updated.vercel.app"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ WORKING ROOT RESPONSE');
});

// ✅ Mount API routes
app.use('/api/users', authRoutes);
app.use('/api/recipes', recipeRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err?.message || err);
  });
