import { query } from '../database.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// --- DISASTERS ---

// Get All Disasters
export const getDisasters = async (req, res) => {
  try {
    const result = await query('SELECT * FROM disasters ORDER BY created_at DESC');
    sendSuccess(res, 200, 'Disasters fetched', result.rows);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// Create Disaster
export const createDisaster = async (req, res) => {
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
};

// --- VOLUNTEER EVENTS ---

// Get All Volunteer Events
export const getVolunteerEvents = async (req, res) => {
  try {
    const result = await query('SELECT * FROM volunteer_events ORDER BY event_date ASC');
    sendSuccess(res, 200, 'Events fetched', result.rows);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// Create Volunteer Event (Handles Image Upload)
export const createVolunteerEvent = async (req, res) => {
  try {
    // 1. Extract text fields
    const { title, description, location, event_date, duration, items_needed } = req.body;

    // 2. Extract File Path (if uploaded)
    let image_url = null;
    if (req.file) {
      // Result: /uploads/volunteer/my-image-12345.jpg
      image_url = `/uploads/volunteer/${req.file.filename}`;
    }

    // 3. Insert into Database
    const result = await query(
      `INSERT INTO volunteer_events (title, description, image_url, location, event_date, duration, items_needed, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, image_url, location, event_date, duration, items_needed, req.user.id],
    );

    sendSuccess(res, 201, 'Volunteer event created', result.rows[0]);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};
