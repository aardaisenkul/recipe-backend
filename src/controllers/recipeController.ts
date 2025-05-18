import { Request, Response } from 'express';
import { RecipeModel } from '../models/Recipe';
import { IngredientModel } from '../models/Ingredient';
import { AuthRequest } from '../middleware/auth';

/**
 * RecipeController class
 * This is the Controller part of MVC pattern
 * Controllers handle the business logic and coordinate between models and routes
 * They process requests, interact with models, and send responses
 */
export class RecipeController {
  private recipeModel: RecipeModel;
  private ingredientModel: IngredientModel;

  constructor(recipeModel: RecipeModel, ingredientModel: IngredientModel) {
    this.recipeModel = recipeModel;
    this.ingredientModel = ingredientModel;
  }

  /**
   * Create a new recipe
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async createRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeData = {
        ...req.body,
        user_id: req.user!.id,
      };
      const recipe = await this.recipeModel.create(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ error: 'Error creating recipe' });
    }
  }

  /**
   * Get all recipes for the authenticated user
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async getAllRecipes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipes = await this.recipeModel.findByUserId(req.user!.id);
      res.json(recipes);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching recipes' });
    }
  }

  /**
   * Get a specific recipe by ID with its ingredients
   * @param req - Express request object
   * @param res - Express response object
   */
  async getRecipeById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipe = await this.recipeModel.findById(parseInt(req.params.id));
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      const ingredients = await this.ingredientModel.findByRecipeId(recipe.id);
      res.json({ ...recipe, ingredients });
    } catch (error) {
      res.status(400).json({ error: 'Error fetching recipe' });
    }
  }

  /**
   * Update an existing recipe
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async updateRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipe = await this.recipeModel.findById(parseInt(req.params.id));
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      if (recipe.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Not authorized to update this recipe' });
        return;
      }
      const updatedRecipe = await this.recipeModel.update(recipe.id, req.body);
      res.json(updatedRecipe);
    } catch (error) {
      res.status(400).json({ error: 'Error updating recipe' });
    }
  }

  /**
   * Delete a recipe and its associated ingredients
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async deleteRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipe = await this.recipeModel.findById(parseInt(req.params.id));
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      if (recipe.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Not authorized to delete this recipe' });
        return;
      }
      await this.ingredientModel.deleteByRecipeId(recipe.id);
      await this.recipeModel.delete(recipe.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Error deleting recipe' });
    }
  }

  /**
   * Add ingredients to a recipe
   * @param req - Express request object with user authentication
   * @param res - Express response object
   */
  async addIngredient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipe = await this.recipeModel.findById(parseInt(req.params.id));
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      if (recipe.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Not authorized to modify this recipe' });
        return;
      }
      const ingredient = await this.ingredientModel.create({
        ...req.body,
        recipe_id: recipe.id,
      });
      res.status(201).json(ingredient);
    } catch (error) {
      res.status(400).json({ error: 'Error adding ingredient' });
    }
  }

  /**
   * Search recipes by query
   * @param req - Express request object
   * @param res - Express response object
   */
  async searchRecipes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipes = await this.recipeModel.search(req.params.query);
      res.json(recipes);
    } catch (error) {
      res.status(400).json({ error: 'Error searching recipes' });
    }
  }
} 