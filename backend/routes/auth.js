import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import process from 'process';
import { query } from '../database.js'; // Import shared DB connection

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// 1. SIGNUP
router.post('/signup', async (request, response) => {
  try {
    const { username, email, password } = request.body;

    const userCheck = await query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, theme_preference, language_preference',
      [username, email, hashedPassword],
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, SECRET_KEY, {
      expiresIn: '1h',
    });

    response.json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error during signup' });
  }
});

// 2. LOGIN
router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return response.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return response.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    response.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        theme_preference: user.theme_preference,
        language_preference: user.language_preference,
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
