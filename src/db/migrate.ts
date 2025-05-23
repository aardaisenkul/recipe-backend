import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  // Log the database URL (without password) for debugging
  console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : undefined
  });

  try {
    // Test connection
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful!', result.rows[0]);

    // Read and execute schema
    console.log('Reading schema file...');
    const schemaFile = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaFile, 'utf8');
    
    console.log('Executing schema...');
    await pool.query(schemaSQL);
    console.log('Schema executed successfully!');

    // Read and execute seed data
    console.log('Reading seed file...');
    const seedFile = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedFile, 'utf8');
    
    console.log('Executing seed data...');
    await pool.query(seedSQL);
    console.log('Seed data executed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate(); 