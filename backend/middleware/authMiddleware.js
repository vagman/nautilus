import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import process from 'process';
import { query } from '../database.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'You are not logged in! Please log in to get access.' });
    }

    // 2) Verify token
    // This throws an error if the token is invalid or expired
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    // (In case the user was deleted from DB but still has a valid token)
    const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const currentUser = result.rows[0];

    if (!currentUser) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser; // Attach user to the request object
    next(); // Pass control to the next middleware/controller
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the 'protect' middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: { code: 403, message: 'Forbidden' },
        error: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
