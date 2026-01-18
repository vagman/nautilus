import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/authMiddleware.js';
import { query } from '../database.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

const router = express.Router();

// --- DISASTERS ---
// Get All Disasters (Public/User)
router.get('/disasters', protect, async (req, res) => {
  try {
    const result = await query('SELECT * FROM disasters ORDER BY created_at DESC');
    sendSuccess(res, 200, 'Disasters fetched', result.rows);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// Create Disaster (Admin Only)
router.post('/disasters', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { title, description, latitude, longitude, severity } = req.body;
    const result = await query(
      `INSERT INTO disasters (title, description, latitude, longitude, severity, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, latitude, longitude, severity, req.user.id],
    );
    sendSuccess(res, 201, 'Disaster reported', result.rows[0]);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// --- VOLUNTEER EVENTS ---
// Get All Events
router.get('/volunteer', protect, async (req, res) => {
  try {
    const result = await query('SELECT * FROM volunteer_events ORDER BY event_date ASC');
    sendSuccess(res, 200, 'Events fetched', result.rows);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// Create Event (Admin Only)
router.post('/volunteer', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { title, description, image_url, location, event_date, duration, items_needed } = req.body;
    const result = await query(
      `INSERT INTO volunteer_events (title, description, image_url, location, event_date, duration, items_needed, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, image_url, location, event_date, duration, items_needed, req.user.id],
    );
    sendSuccess(res, 201, 'Volunteer event created', result.rows[0]);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

export default router;
