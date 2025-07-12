const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// ✅ GET /recipes/pending - Fetch unapproved recipes
router.get("/pending", async (req, res) => {
  try {
    const recipes = await Recipe.find({ approved: false });
    res.json(
      recipes
        .filter(r => r && r._id)
        .map(r => ({
          ...r._doc,
          _id: r._id.toString(),
        }))
    );
  } catch (err) {
    console.error("❌ Failed to fetch pending recipes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET /recipes/approved - Fetch approved recipes
router.get("/approved", async (req, res) => {
  try {
    const recipes = await Recipe.find({ approved: true });
    res.json(
      recipes
        .filter(r => r && r._id)
        .map(r => ({
          ...r._doc,
          _id: r._id.toString(),
        }))
    );
  } catch (err) {
    console.error("❌ Failed to fetch approved recipes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET /recipes - Only fetch approved recipes (for users)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const query = { approved: true };
    if (category) query.category = category;

    const recipes = await Recipe.find(query);

    const safeRecipes = recipes
      .filter(r => r && r._id)
      .map(r => ({
        ...r._doc,
        _id: r._id.toString(),
      }));

    res.json(safeRecipes);
  } catch (err) {
    console.error("❌ Failed to fetch recipes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST /recipes - Add a new recipe
router.post("/", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();

    res.status(201).json({
      ...recipe._doc,
      _id: recipe._id.toString(),
    });
  } catch (err) {
    console.error("❌ Error adding recipe:", err);
    res.status(500).json({ error: err.message || "Failed to add recipe" });
  }
});

// ✅ GET /recipes/:id - Get a single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id === "pending" || id === "approved") {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json({
      ...recipe._doc,
      _id: recipe._id.toString(),
    });
  } catch (err) {
    console.error("❌ Error fetching recipe by ID:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// ✅ DELETE /recipes/:id - Delete a recipe by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Recipe not found" });

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ PATCH /recipes/:id/approve - Admin approves recipe
router.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({
      message: "Recipe approved successfully",
      recipe: {
        ...recipe._doc,
        _id: recipe._id.toString(),
      },
    });
  } catch (err) {
    console.error("❌ Error approving recipe:", err.message);
    res.status(500).json({ error: "Failed to approve recipe" });
  }
});

module.exports = router;
