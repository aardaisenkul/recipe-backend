import { Router } from 'express';
import { RecipeModel } from '../models/Recipe';
import { IngredientModel } from '../models/Ingredient';
import { RecipeController } from '../controllers/recipeController';
import { auth } from '../middleware/auth';
import pool from '../db';

/**
 * Recipe Routes
 * This file defines all the routes related to recipes
 * Routes are the entry points for HTTP requests and connect them to controllers
 * Each route specifies:
 * 1. The HTTP method (GET, POST, etc.)
 * 2. The URL path
 * 3. Any middleware (like authentication)
 * 4. The controller method to handle the request
 */

const router = Router();

// Initialize models and controller
const recipeModel = new RecipeModel(pool);
const ingredientModel = new IngredientModel(pool);
const recipeController = new RecipeController(recipeModel, ingredientModel);

// Create a new recipe
router.post('/', auth, recipeController.createRecipe.bind(recipeController));

// Get all recipes for the authenticated user
router.get('/', auth, recipeController.getAllRecipes.bind(recipeController));

// Get a specific recipe with its ingredients
router.get('/:id', recipeController.getRecipeById.bind(recipeController));

// Update an existing recipe
router.patch('/:id', auth, recipeController.updateRecipe.bind(recipeController));

// Delete a recipe
router.delete('/:id', auth, recipeController.deleteRecipe.bind(recipeController));

// Add ingredients to a recipe
router.post('/:id/ingredients', auth, recipeController.addIngredient.bind(recipeController));

// Search recipes
router.get('/search/:query', recipeController.searchRecipes.bind(recipeController));

export default router;