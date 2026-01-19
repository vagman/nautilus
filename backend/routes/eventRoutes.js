import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { uploadVolunteer } from '../middleware/uploadMiddleware.js';
import {
  getDisasters,
  createDisaster,
  getVolunteerEvents,
  createVolunteerEvent,
} from '../controllers/eventController.js';

const router = express.Router();

// --- DISASTERS ---
router.get('/disasters', protect, getDisasters);
router.post('/disasters', protect, restrictTo('admin'), createDisaster);

// --- VOLUNTEER EVENTS ---
router.get('/volunteer', protect, getVolunteerEvents);

// Add 'uploadVolunteer.single' middleware here to handle the file BEFORE the controller runs
router.post('/volunteer', protect, restrictTo('admin'), uploadVolunteer.single('image'), createVolunteerEvent);

export default router;
