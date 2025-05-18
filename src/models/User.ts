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
    try {
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      console.log('Executing create user query...');
      const query = `
        INSERT INTO users (username, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `;
      const values = [username, email, hashedPassword];
      
      console.log('Query:', query);
      console.log('Values:', { username, email, password: '****' });
      
      const result = await this.pool.query(query, values);
      console.log('Create user result:', { id: result.rows[0].id, email: result.rows[0].email });
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in create user:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      console.log('Finding user by email:', email);
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await this.pool.query(query, [email]);
      console.log('Find by email result:', result.rows[0] ? { id: result.rows[0].id, email: result.rows[0].email } : 'No user found');
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in find by email:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      console.log('Finding user by id:', id);
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      console.log('Find by id result:', result.rows[0] ? { id: result.rows[0].id, email: result.rows[0].email } : 'No user found');
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in find by id:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    try {
      console.log('Updating user:', { id, data });
      const allowedFields = ['username', 'email', 'password'];
      const updates = Object.entries(data)
        .filter(([key]) => allowedFields.includes(key))
        .map(([key, value], index) => `${key} = $${index + 2}`)
        .join(', ');

      if (!updates) {
        console.log('No valid fields to update');
        return null;
      }

      const values = [id, ...Object.values(data).filter(value => value !== undefined)];
      const query = `
        UPDATE users 
        SET ${updates}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      console.log('Update query:', query);
      console.log('Update values:', values);
      
      const result = await this.pool.query(query, values);
      console.log('Update result:', result.rows[0] ? { id: result.rows[0].id, email: result.rows[0].email } : 'No user updated');
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in update user:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      console.log('Deleting user:', id);
      const query = 'DELETE FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      const deleted = result.rowCount !== null && result.rowCount > 0;
      console.log('Delete result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error in delete user:', error);
      throw error;
    }
  }
} 