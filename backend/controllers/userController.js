import { query } from '../database.js';

// 1. Update User Profile (Generic)
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, profile_picture, theme_preference, language_preference } = req.body;

  try {
    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (first_name !== undefined) {
      fields.push(`first_name = $${queryIndex++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push(`last_name = $${queryIndex++}`);
      values.push(last_name);
    }
    if (profile_picture !== undefined) {
      fields.push(`profile_picture = $${queryIndex++}`);
      values.push(profile_picture);
    }
    if (theme_preference !== undefined) {
      fields.push(`theme_preference = $${queryIndex++}`);
      values.push(theme_preference);
    }
    if (language_preference !== undefined) {
      fields.push(`language_preference = $${queryIndex++}`);
      values.push(language_preference);
    }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

    const result = await query(sql, values);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const updatedUser = result.rows[0];
    delete updatedUser.password_hash;

    res.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// 2. Update Theme Specific
export const updateTheme = async (req, res) => {
  const { id } = req.params;
  const { theme } = req.body; // Frontend sends { theme: 'dark' }

  try {
    const result = await query('UPDATE users SET theme_preference = $1 WHERE id = $2 RETURNING id, theme_preference', [
      theme,
      id,
    ]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update Theme Error:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
};

// 3. Update Language Specific
export const updateLanguage = async (req, res) => {
  const { id } = req.params;
  const { language } = req.body; // Frontend sends { language: 'en' }

  try {
    const result = await query(
      'UPDATE users SET language_preference = $1 WHERE id = $2 RETURNING id, language_preference',
      [language, id],
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update Language Error:', error);
    res.status(500).json({ error: 'Failed to update language' });
  }
};

// 4. Delete Account
export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting account' });
  }
};
