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

router.put('/:id', protect, uploadProfile.single('profile_picture'), async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const userId = req.params.id;

    const userCheck = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldUser = userCheck.rows[0];
    let profilePath = oldUser.profile_picture;

    if (req.file) {
      // ✅ IMPROVED SAFE DELETION
      // Only run if there's an existing string that looks like a local upload path
      if (typeof oldUser.profile_picture === 'string' && oldUser.profile_picture.includes('/uploads/profiles/')) {
        try {
          const oldFileName = oldUser.profile_picture.split('/').pop();
          const oldFilePath = path.join(__dirname, '..', 'uploads', 'profiles', oldFileName);

          // Use synchronous existsCheck to prevent race conditions during the update
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`🗑️ Deleted old file: ${oldFileName}`);
          }
        } catch (err) {
          console.warn('⚠️ Could not delete old file, but continuing update:', err.message);
        }
      }
      // Set new image path
      profilePath = `http://localhost:4000/uploads/profiles/${req.file.filename}`;
    }

    const updateQuery = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, profile_picture = $4
      WHERE id = $5
      RETURNING id, first_name, last_name, email, role, profile_picture, theme_preference, language_preference
    `;

    const result = await query(updateQuery, [
      first_name || oldUser.first_name,
      last_name || oldUser.last_name,
      email || oldUser.email,
      profilePath,
      userId,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// UPDATE LANGUAGE PREFERENCE
router.put('/:id/language', protect, async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.params.id;

    const result = await query(
      'UPDATE users SET language_preference = $1 WHERE id = $2 RETURNING language_preference',
      [language, userId],
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Language Update Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE THEME PREFERENCE
router.put('/:id/theme', protect, async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.params.id;

    const result = await query('UPDATE users SET theme_preference = $1 WHERE id = $2 RETURNING theme_preference', [
      theme,
      userId,
    ]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Theme Update Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
