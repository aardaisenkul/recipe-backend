import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Log the database URL (without password) for debugging
const dbUrl = process.env.DATABASE_URL;
console.log('Database URL:', dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'Not set');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

export default pool;