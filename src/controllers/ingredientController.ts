import { Response } from 'express';
import { IngredientModel } from '../models/Ingredient';
import { RecipeModel } from '../models/Recipe';
import { AuthRequest } from '../middleware/auth';

/**
 * IngredientController class
 * Handles all ingredient-related operations
 * Ingredients are always associated with a recipe
 */
export class IngredientController {
  private ingredientModel: IngredientModel;
  private recipeModel: RecipeModel;

  constructor(ingredientModel: IngredientModel, recipeModel: RecipeModel) {
    this.ingredientModel = ingredientModel;
    this.recipeModel = recipeModel;
  }

  /**
   * Get all ingredients for a recipe
   * @param req - Express request object
   * @param res - Express response object
   */
  async getIngredients(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.recipeId);
      const ingredients = await this.ingredientModel.findByRecipeId(recipeId);
      res.json(ingredients);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching ingredients' });
    }
  }

  /**
   * Add a new ingredient to a recipe
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async addIngredient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.recipeId);

      // Check if recipe exists and user owns it
      const recipe = await this.recipeModel.findById(recipeId);
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      if (recipe.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Not authorized to modify this recipe' });
        return;
      }

      // Create new ingredient
      const ingredient = await this.ingredientModel.create({
        ...req.body,
        recipe_id: recipeId
      });

      res.status(201).json(ingredient);
    } catch (error) {
      res.status(400).json({ error: 'Error adding ingredient' });
    }
  }

  /**
   * Update an ingredient
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async updateIngredient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ingredientId = parseInt(req.params.id);
      const recipeId = parseInt(req.params.recipeId);

      // Check if recipe exists and user owns it
      const recipe = await this.recipeModel.findById(recipeId);
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      if (recipe.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Not authorized to modify this recipe' });
        return;
      }

      // Update ingredient
      const updatedIngredient = await this.ingredientModel.update(ingredientId, req.body);
      if (!updatedIngredient) {
        res.status(404).json({ error: 'Ingredient not found' });
        return;
      }

      res.json(updatedIngredient);
    } catch (error) {
      res.status(400).json({ error: 'Error updating ingredient' });
    }
  }

  /**
   * Delete an ingredient
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async deleteIngredient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ingredientId = parseInt(req.params.id);
      const recipeId = parseInt(req.params.recipeId);

      // Check if recipe exists and user owns it
      const recipe = await this.recipeModel.findById(recipeId);
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      if (recipe.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Not authorized to modify this recipe' });
        return;
      }

      // Delete ingredient
      const success = await this.ingredientModel.delete(ingredientId);
      if (!success) {
        res.status(404).json({ error: 'Ingredient not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Error deleting ingredient' });
    }
  }
} 