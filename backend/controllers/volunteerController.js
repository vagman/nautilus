import fs from 'fs';
import path from 'path';
import { query } from '../database.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import process from 'process';

const ensureDirectoryExists = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const getVolunteerEvents = async (request, response) => {
  try {
    // This will now automatically fetch latitude and longitude columns as well
    const result = await query('SELECT * FROM volunteer_events ORDER BY event_date ASC');
    sendSuccess(response, 200, 'Events fetched', result.rows);
  } catch (error) {
    sendError(response, 500, error.message);
  }
};

// --- CREATE VOLUNTEER EVENT ---
export const createVolunteerEvent = async (request, response) => {
  try {
    // 1. Extract latitude and longitude from the request body
    const { title, description, location, event_date, duration, items_needed, latitude, longitude } = request.body;

    const uploadDir = path.join(process.cwd(), 'uploads', 'volunteer_events');
    ensureDirectoryExists(uploadDir);

    let event_image = null;
    if (request.file) {
      // Ensure this URL matches your static file serving setup in server.js
      event_image = `http://localhost:4000/uploads/volunteer_events/${request.file.filename}`;
    }

    // 2. Update the SQL Query to include latitude and longitude
    const result = await query(
      `INSERT INTO volunteer_events 
       (title, description, location, event_date, duration, items_needed, latitude, longitude, event_image, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        title,
        description,
        location,
        event_date,
        duration,
        items_needed,
        latitude,
        longitude,
        event_image,
        request.user.id,
      ],
    );

    sendSuccess(response, 201, 'Event created', result.rows[0]);
  } catch (error) {
    console.error('Create Volunteer Error:', error);
    sendError(response, 500, error.message);
  }
};
