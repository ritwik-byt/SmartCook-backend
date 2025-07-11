const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  category: { type: String, default: '' },
  cookTime: { type: Number, default: 0 },
  servings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  author: { type: String, default: 'Unknown' },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
