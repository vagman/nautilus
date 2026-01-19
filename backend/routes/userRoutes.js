import express from 'express';
import { updateProfile, deleteAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all routes below (Professional Short-hand)
router.use(protect);

// Routes
router.put('/api/users/:id', updateProfile);
router.delete('/api/users/:id', deleteAccount);

export default router;
