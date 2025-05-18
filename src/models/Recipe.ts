import { Pool } from 'pg';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  instructions: string;
  cooking_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export class RecipeModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    const query = `
      INSERT INTO recipes (
        title, description, instructions, cooking_time, 
        servings, difficulty, user_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    const values = [
      recipe.title,
      recipe.description,
      recipe.instructions,
      recipe.cooking_time,
      recipe.servings,
      recipe.difficulty,
      recipe.user_id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Recipe | null> {
    const query = 'SELECT * FROM recipes WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: number): Promise<Recipe[]> {
    const query = 'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async update(id: number, data: Partial<Recipe>): Promise<Recipe | null> {
    const allowedFields = [
      'title',
      'description',
      'instructions',
      'cooking_time',
      'servings',
      'difficulty',
    ];
    const updates = Object.entries(data)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key, value], index) => `${key} = $${index + 2}`)
      .join(', ');

    if (!updates) return null;

    const values = [id, ...Object.values(data).filter(value => value !== undefined)];
    const query = `
      UPDATE recipes 
      SET ${updates}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM recipes WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async search(query: string): Promise<Recipe[]> {
    const searchQuery = `
      SELECT * FROM recipes 
      WHERE 
        title ILIKE $1 OR 
        description ILIKE $1 OR 
        instructions ILIKE $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(searchQuery, [`%${query}%`]);
    return result.rows;
  }
} 