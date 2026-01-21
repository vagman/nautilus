import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import process from 'process';
import isEmail from 'validator/lib/isEmail.js';
import { query } from '../database.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

const SECRET_KEY = process.env.JWT_SECRET;

const signToken = id => {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// Helper function to send token and user data
const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user.id);

  // Remove password from output
  delete user.password_hash;

  // Optional: Send Cookie (Professional Security)
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true, // Browser cannot access cookie (prevents XSS)
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Use our Standard Response
  sendSuccess(res, statusCode, message, {
    token,
    user,
  });
};

// 1. SIGNUP
export const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    console.log(`📝 Signup attempt for: ${email}`);

    // Validation
    if (!isEmail(email)) return sendError(res, 400, 'Invalid email format');

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) return sendError(res, 400, 'Password too weak');

    // Check if Email Exists
    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) return sendError(res, 400, 'User already exists');

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // INSERT
    const newUser = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, first_name, last_name, email, theme_preference, language_preference, profile_image`,
      [first_name, last_name, email, hashedPassword],
    );

    console.log(`✅ SUCCESS: User created [ID: ${newUser.rows[0].id}]`);

    createSendToken(newUser.rows[0], 201, res, 'Account created successfully');
  } catch (err) {
    console.error('🔥 Server Error during signup:', err);
    sendError(res, 500, 'Server error during signup');
  }
};

// 2. LOGIN
export const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    console.log(`🔑 Login attempt for: ${email}`);

    if (!email || !password) return sendError(response, 400, 'Provide email and password');

    // Check User
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return sendError(response, 401, 'Invalid credentials');

    const user = result.rows[0];

    // Verify Password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return sendError(response, 401, 'Invalid credentials');

    console.log(`✅ SUCCESS: User logged in [ID: ${user.id}]`);

    createSendToken(user, 200, response, 'Logged in successfully');
  } catch (err) {
    console.error('🔥 Server Error during login:', err);
    sendError(response, 500, 'Server error during login');
  }
};
