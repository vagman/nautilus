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

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// --- 🛡️ SECURITY: RATE LIMITERS ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please slow down.' },
});

// --- APPLY LIMITERS ---
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

app.use('/api/', apiLimiter);

// --- USE ROUTERS ---
app.use('/api/auth', authRoutes);

// ✅ FIX: Mount this at '/api/users' so it matches your frontend calls
app.use('/api/users', userRoutes);

// 3. Event Routes (Mounted at /api)
app.use('/api', eventRoutes);

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
