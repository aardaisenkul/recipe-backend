import { Router } from 'express';
import { IngredientModel } from '../models/Ingredient';
import { RecipeModel } from '../models/Recipe';
import { IngredientController } from '../controllers/ingredientController';
import { auth } from '../middleware/auth';
import pool from '../db';

/**
 * Ingredient Routes
 * Defines all routes related to ingredient operations
 * All routes are nested under recipes since ingredients belong to recipes
 */
const router = Router({ mergeParams: true }); // Enable access to parent route params

// Initialize models and controller
const ingredientModel = new IngredientModel(pool);
const recipeModel = new RecipeModel(pool);
const ingredientController = new IngredientController(ingredientModel, recipeModel);

// Get all ingredients for a recipe
router.get('/', ingredientController.getIngredients.bind(ingredientController));

// Add a new ingredient to a recipe (requires authentication)
router.post('/', auth, ingredientController.addIngredient.bind(ingredientController));

// Update an ingredient (requires authentication)
router.patch('/:id', auth, ingredientController.updateIngredient.bind(ingredientController));

// Delete an ingredient (requires authentication)
router.delete('/:id', auth, ingredientController.deleteIngredient.bind(ingredientController));

export default router; 