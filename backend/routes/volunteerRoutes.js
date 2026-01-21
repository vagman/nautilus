import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { uploadVolunteer } from '../middleware/uploadMiddleware.js';
import { getVolunteerEvents, createVolunteerEvent } from '../controllers/volunteerController.js';

const router = express.Router();

router.get('/', protect, getVolunteerEvents);
router.post('/', protect, restrictTo('admin'), uploadVolunteer.single('image'), createVolunteerEvent);

export default router;
