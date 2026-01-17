import express from 'express';
import { query } from '../database.js';

const router = express.Router();

// 3. UPDATE THEME
// Note: Frontend calls /users/:id/theme
router.put('/users/:id/theme', async (request, response) => {
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

// 4. UPDATE LANGUAGE
// Note: Frontend calls /api/users/:id/language
router.put('/api/users/:id/language', async (request, response) => {
  try {
    const { id } = request.params;
    const { language } = request.body;

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

// 5. DELETE ACCOUNT
// Note: Frontend calls /api/users/:id
router.delete('/api/users/:id', async (request, response) => {
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

export default router;
