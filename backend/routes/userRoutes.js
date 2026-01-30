import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfile } from '../middleware/uploadMiddleware.js';
import { query } from '../database.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.put('/:id', protect, uploadProfile.single('profile_image'), async (request, response) => {
  try {
    const { first_name, last_name, email } = request.body;
    const userId = request.params.id;

    const userCheck = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }

    const oldUser = userCheck.rows[0];
    let profilePath = oldUser.profile_image;

    if (request.file) {
      // Only run if there's an existing string that looks like a local upload path
      if (typeof oldUser.profile_image === 'string' && oldUser.profile_image.includes('/uploads/profiles/')) {
        try {
          const oldFileName = oldUser.profile_image.split('/').pop();
          const oldFilePath = path.join(__dirname, '..', 'uploads', 'profiles', oldFileName);

          // Use synchronous existsCheck to prevent race conditions during the update
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`🗑️ Deleted old file: ${oldFileName}`);
          }
        } catch (error) {
          console.warn('⚠️ Could not delete old file, but continuing update:', error.message);
        }
      }
      // Set new image path
      profilePath = `http://localhost:4000/uploads/profiles/${request.file.filename}`;
    }

    const updateQuery = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, profile_image = $4
      WHERE id = $5
      RETURNING id, first_name, last_name, email, role, profile_image, theme_preference, language_preference
    `;

    const result = await query(updateQuery, [
      first_name || oldUser.first_name,
      last_name || oldUser.last_name,
      email || oldUser.email,
      profilePath,
      userId,
    ]);

    response.json(result.rows[0]);
  } catch (error) {
    console.error('Update Profile Error:', error);
    response.status(500).json({ error: 'Server error updating profile' });
  }
});

// Update language preference
router.put('/:id/language', protect, async (request, response) => {
  try {
    const { language } = request.body;
    const userId = request.params.id;

    const result = await query(
      'UPDATE users SET language_preference = $1 WHERE id = $2 RETURNING language_preference',
      [language, userId],
    );

    if (result.rows.length === 0) return response.status(404).json({ error: 'User not found' });
    response.json(result.rows[0]);
  } catch (error) {
    console.error('Language Update Error:', error);
    response.status(500).json({ error: 'Server error' });
  }
});

// Update theme preference
router.put('/:id/theme', protect, async (request, response) => {
  try {
    const { theme } = request.body;
    const userId = request.params.id;

    const result = await query('UPDATE users SET theme_preference = $1 WHERE id = $2 RETURNING theme_preference', [
      theme,
      userId,
    ]);

    if (result.rows.length === 0) return response.status(404).json({ error: 'User not found' });
    response.json(result.rows[0]);
  } catch (error) {
    console.error('Theme Update Error:', error);
    response.status(500).json({ error: 'Server error' });
  }
});

export default router;
