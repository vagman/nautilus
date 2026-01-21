import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './database.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//  Serve Uploaded Files Publicly
// This allows the frontend to view images at http://localhost:4000/uploads/volunteer/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/users', userRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/volunteer', volunteerRoutes);

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
