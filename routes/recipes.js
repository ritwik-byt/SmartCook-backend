const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// ✅ GET all approved recipes with formatted response
router.get("/", async (req, res) => {
  try {
    const rawRecipes = await Recipe.find({ approved: true }).sort({ createdAt: -1 });

    const formattedRecipes = rawRecipes.map(r => ({
      id: r._id.toString(),
      title: r.title,
      description: r.description || '',
      imageUrl: r.image || '',
      category: r.category || '',
      cookTime: r.cookTime || 0,
      servings: r.servings || 0,
      rating: r.rating || 0,
      likes: r.likes || 0,
      author: r.author || 'Unknown',
      createdAt: r.createdAt,
      ingredients: r.ingredients || [],
      instructions: r.instructions || []
    }));

    res.json(formattedRecipes);
  } catch (err) {
    console.error("❌ Failed to fetch recipes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST new recipe (starts as pending) — with full fields
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      category,
      cookTime,
      servings,
      rating,
      likes,
      author,
      ingredients,
      instructions,
    } = req.body;

    const newRecipe = new Recipe({
      title,
      description,
      image: imageUrl,
      category,
      cookTime,
      servings,
      rating,
      likes,
      author,
      ingredients,
      instructions,
      approved: false // All recipes start as pending
    });

    await newRecipe.save();
    res.status(201).json({ message: 'Recipe submitted for approval', recipe: newRecipe });

  } catch (error) {
    console.error('❌ Error creating recipe:', error);
    res.status(500).json({ message: 'Failed to create recipe' });
  }
});

// ✅ ADMIN: Get all pending recipes
router.get("/pending", async (req, res) => {
  try {
    const recipes = await Recipe.find({ approved: false });
    res.json(recipes);
  } catch (err) {
    console.error("❌ Failed to fetch pending recipes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET recipes created by current user (My Recipes)
router.get("/mine", async (req, res) => {
  try {
    const userName = req.query.author;
    if (!userName) {
      return res.status(400).json({ error: "Missing author name" });
    }

    const userRecipes = await Recipe.find({ author: userName });
    const formattedRecipes = userRecipes.map(r => ({
      id: r._id.toString(),
      title: r.title,
      description: r.description || '',
      imageUrl: r.image || '',
      category: r.category || '',
      cookTime: r.cookTime || 0,
      servings: r.servings || 0,
      rating: r.rating || 0,
      likes: r.likes || 0,
      author: r.author || 'Unknown',
      createdAt: r.createdAt,
      ingredients: r.ingredients || [],
      instructions: r.instructions || [],
      approved: r.approved || false
    }));

    res.json(formattedRecipes);
  } catch (err) {
    console.error("❌ Failed to fetch user's recipes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ ADMIN: Approve a pending recipe (RESTful path)
router.patch("/:id/approve", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error("❌ Failed to approve recipe:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ ADMIN: Delete a recipe (decline)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("❌ Failed to delete recipe:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
