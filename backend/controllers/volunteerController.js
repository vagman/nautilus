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
    const result = await query('SELECT * FROM volunteer_events ORDER BY event_date ASC');
    sendSuccess(response, 200, 'Events fetched', result.rows);
  } catch (error) {
    sendError(response, 500, error.message);
  }
};

export const createVolunteerEvent = async (request, response) => {
  try {
    const { title, description, location, event_date, duration, items_needed } = request.body;

    const uploadDir = path.join(process.cwd(), 'uploads', 'volunteer_events');
    ensureDirectoryExists(uploadDir);

    let event_image = null;
    if (request.file) {
      event_image = `http://localhost:4000/uploads/volunteer_events/${request.file.filename}`;
    }

    const result = await query(
      `INSERT INTO volunteer_events 
       (title, description, location, event_date, duration, items_needed, event_image, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, location, event_date, duration, items_needed, event_image, request.user.id],
    );

    sendSuccess(response, 201, 'Event created', result.rows[0]);
  } catch (error) {
    console.error('Create Volunteer Error:', error);
    sendError(response, 500, error.message);
  }
};
