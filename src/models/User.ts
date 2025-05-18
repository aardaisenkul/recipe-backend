import { Pool } from 'pg';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    const values = [username, email, hashedPassword];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const allowedFields = ['username', 'email', 'password'];
    const updates = Object.entries(data)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key, value], index) => `${key} = $${index + 2}`)
      .join(', ');

    if (!updates) return null;

    const values = [id, ...Object.values(data).filter(value => value !== undefined)];
    const query = `
      UPDATE users 
      SET ${updates}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
} 