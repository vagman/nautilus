import express from 'express';
import { updateProfile, deleteAccount, updateTheme, updateLanguage } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Routes
// 1. General Profile Update
router.put('/:id', updateProfile);

// 2. Specific Preference Updates (Matches your Settings.jsx calls)
router.put('/:id/theme', updateTheme);
router.put('/:id/language', updateLanguage);

// 3. Delete Account
router.delete('/:id', deleteAccount);

export default router;
