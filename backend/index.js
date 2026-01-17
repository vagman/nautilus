import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './database.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const SECRET_KEY = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.post('/signup', async (request, response) => {
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

// 2. LOGIN ROUTE
app.post('/login', async (request, response) => {
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

app.put('/users/:id/theme', async (request, response) => {
  try {
    const { id } = request.params;
    const { theme } = request.body;

    const result = await query(
      'UPDATE users SET theme_preference = $1 WHERE id = $2 RETURNING id, theme_preference',
      [theme, id],
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to update theme' });
  }
});

app.put('/api/users/:id/language', async (request, response) => {
  try {
    const { id } = request.params;
    const { language } = request.body; // Expects "en" or "el"

    const result = await query(
      'UPDATE users SET language_preference = $1 WHERE id = $2 RETURNING id, language_preference',
      [language, id],
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to update language' });
  }
});


app.delete('/api/users/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const checkUser = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);

    response.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error during deletion' });
  }
});

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
