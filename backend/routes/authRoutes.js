import express from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import process from 'process';

import { signup, login } from '../controllers/authController.js';
import { query } from '../database.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  from: 'Nautilus App <bmanousakis@gmail.com>',
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

// Specific Rate Limiter for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' },
});

// 1. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('1. Processing Forgot Password for:', email); // 🔍 Log 1

  try {
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
    console.log('2. User Found:', userResult.rows.length > 0); // 🔍 Log 2

    if (userResult.rows.length === 0) {
      console.log('❌ User does not exist in DB');
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }
    const userId = userResult.rows[0].id;

    // Generate Token
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1 hour

    await query(
      `INSERT INTO password_resets (user_id, token, expires_at) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) 
       DO UPDATE SET token = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [userId, token, expiresAt],
    );

    // Send Email
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions = {
      from: 'Nautilus App <bmanousakis@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset.\n\nPlease click the link below to reset it:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    };

    console.log('3. Attempting to send email via OAuth2...');

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ EMAIL ERROR:', error);
      } else {
        console.log('✅ EMAIL SENT:', info.response);
      }
      // Send response to frontend regardless (security best practice)
      res.json({ message: 'If an account exists, a reset link has been sent.' });
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. RESET PASSWORD
router.post('/reset-password', async (request, response) => {
  const { token, newPassword } = request.body;

  try {
    const tokenResult = await query('SELECT * FROM password_resets WHERE token = $1', [token]);

    if (tokenResult.rows.length === 0) {
      return response.status(400).json({ error: 'Invalid or expired token.' });
    }

    const resetRow = tokenResult.rows[0];

    if (Date.now() > Number(resetRow.expires_at)) {
      await query('DELETE FROM password_resets WHERE user_id = $1', [resetRow.user_id]);
      return response.status(400).json({ error: 'Token has expired.' });
    }

    // Hash & Update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, resetRow.user_id]);

    await query('DELETE FROM password_resets WHERE user_id = $1', [resetRow.user_id]);

    response.json({ message: 'Password has been changed successfully' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

export default router;
