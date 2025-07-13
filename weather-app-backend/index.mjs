import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs/promises'; // for reading files asynchronously
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Example route to test DB connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// script to run the SQL file (schema.sql) automatically on server start to ensure tables exist
async function runSchema() {
  try {
    // Read the schema.sql file content
    const schemaPath = path.resolve('./schema.sql'); // Adjust path if needed
    const sql = await fs.readFile(schemaPath, 'utf-8');

    // Run the SQL commands
    await pool.query(sql);
    console.log('Database schema applied successfully!');
  } catch (err) {
    console.error('Error applying schema:', err);
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Run the schema after server starts
  await runSchema();
});
