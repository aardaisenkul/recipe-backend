import { Pool } from 'pg';

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  recipe_id: number;
  created_at: Date;
  updated_at: Date;
}

export class IngredientModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create(ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> {
    const query = `
      INSERT INTO ingredients (
        name, amount, unit, recipe_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [
      ingredient.name,
      ingredient.amount,
      ingredient.unit,
      ingredient.recipe_id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByRecipeId(recipeId: number): Promise<Ingredient[]> {
    const query = 'SELECT * FROM ingredients WHERE recipe_id = $1 ORDER BY name';
    const result = await this.pool.query(query, [recipeId]);
    return result.rows;
  }

  async update(id: number, data: Partial<Ingredient>): Promise<Ingredient | null> {
    const allowedFields = ['name', 'amount', 'unit'];
    const updates = Object.entries(data)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key, value], index) => `${key} = $${index + 2}`)
      .join(', ');

    if (!updates) return null;

    const values = [id, ...Object.values(data).filter(value => value !== undefined)];
    const query = `
      UPDATE ingredients 
      SET ${updates}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM ingredients WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async deleteByRecipeId(recipeId: number): Promise<boolean> {
    const query = 'DELETE FROM ingredients WHERE recipe_id = $1';
    const result = await this.pool.query(query, [recipeId]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
} 