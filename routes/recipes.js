const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// ✅ GET /recipes - Fetch all recipes (with optional category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const recipes = await Recipe.find(query);

    const safeRecipes = recipes
      .filter(recipe => recipe && recipe._id) // ✅ skip any invalid documents
      .map(recipe => ({
        ...recipe._doc,
        _id: recipe._id?.toString() || "", // ✅ safely convert ObjectId
      }));

    res.json(safeRecipes);
  } catch (err) {
    console.error("❌ Failed to fetch recipes:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ POST /recipes - Add a new recipe
router.post("/", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();

    res.status(201).json({
      ...recipe._doc,
      _id: recipe._id.toString(), // ✅ ensure _id is stringified on creation too
    });
  } catch (err) {
    console.error("❌ Error adding recipe:", err);
    res.status(500).json({ error: err.message || "Failed to add recipe" });
  }
});

// ✅ GET /recipes/:id - Get a single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json({
      ...recipe._doc,
      _id: recipe._id.toString(), // ✅ safe conversion
    });
  } catch (err) {
    console.error("❌ Error fetching recipe by ID:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

module.exports = router;
