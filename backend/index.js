import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import rateLimit from 'express-rate-limit';
import { query } from './database.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// ✅ Trust Proxy: Required for Rate Limiting to work correctly behind load balancers (Heroku, AWS, etc.)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// --- 🛡️ SECURITY: RATE LIMITERS ---
// 1. Strict Limiter for Auth (Login/Signup)
// Only allows 5 attempts per 15 minutes to stop brute-force password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. General Limiter for API
// Allows 100 requests per 15 minutes (Good for weather data, profile fetching)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please slow down.' },
});

// --- APPLY LIMITERS ---
// We apply the strict limiter specifically to the auth routes
app.use('/signup', authLimiter);
app.use('/login', authLimiter);
app.use('/change-password', authLimiter); // Protect this too!

// Apply general limiter to other API routes
app.use('/api/', apiLimiter);

// --- USE ROUTERS ---
app.use('/', authRoutes); // Handles /login, /signup, /change-password
app.use('/', userRoutes); // Handles /api/users...
app.use('/api', eventRoutes); // Handles /api/disasters and /api/volunteer

// Test Route
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
