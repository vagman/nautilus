import express from 'express';

import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { uploadDisaster } from '../middleware/uploadMiddleware.js';
import { getDisasters, createDisaster, updateDisaster, deleteDisaster } from '../controllers/disasterController.js';

const router = express.Router();

router.get('/', protect, getDisasters);

router.post('/', protect, restrictTo('admin'), uploadDisaster.single('event_image'), createDisaster);

router.put('/:id', protect, restrictTo('admin'), uploadDisaster.single('event_image'), updateDisaster);

router.delete('/:id', protect, restrictTo('admin'), deleteDisaster);

export default router;
