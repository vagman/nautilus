import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import { query } from './database.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

// --- USE ROUTERS ---
// This tells Express: "If a request comes in, check these files for a matching route"
app.use('/', authRoutes); // Handles /login, /signup
app.use('/', userRoutes); // Handles /users..., /api/users...

// Test Route (Can stay here or move to a separate 'general' router)
app.get('/test-db', async (request, response) => {
  try {
    const result = await query('SELECT NOW()');
    response.json({ message: 'Database Connected!', time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
