import express from 'express';
import { signup, login } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Specific Rate Limiter for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' },
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

export default router;
