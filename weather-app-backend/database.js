import pg from 'pg';
import dotenv from 'dotenv';
import process from 'process';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pg;

// Create a connection pool
// A "Pool" is better than a single Client because it manages multiple
// connections for you automatically (great for web apps).
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection when this file loads
pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL successfully'))
  .catch(error => console.error('❌ Database connection error:', error));

// Export a query function that we can use in other files
export const query = (text, params) => pool.query(text, params);
