const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
