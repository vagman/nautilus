import fs from 'fs';
import path from 'path';
import { query } from '../database.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import process from 'process';

const ensureDirectoryExists = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

const deleteFileFromStorage = imageUrl => {
  if (!imageUrl || !imageUrl.includes('/uploads/disasters/')) return;

  try {
    const filename = imageUrl.split('/').pop();
    const filePath = path.join(process.cwd(), 'uploads', 'disasters', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file from storage: ${filename}`);
    }
  } catch (err) {
    console.error('❌ Failed to delete file:', err.message);
  }
};

// --- GET ALL DISASTERS ---
export const getDisasters = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, description, latitude::float, longitude::float, severity, event_image, created_at FROM disasters ORDER BY created_at DESC',
    );
    sendSuccess(res, 200, 'Disasters fetched', result.rows);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// --- CREATE DISASTER ---
export const createDisaster = async (req, res) => {
  try {
    const { title, description, latitude, longitude, severity } = req.body;

    const uploadDir = path.join(process.cwd(), 'uploads', 'disasters');
    ensureDirectoryExists(uploadDir);

    let event_image = null;
    if (req.file) {
      event_image = `http://localhost:4000/uploads/disasters/${req.file.filename}`;
    }

    const result = await query(
      `INSERT INTO disasters (title, description, latitude, longitude, severity, event_image, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, latitude, longitude, severity, event_image, req.user.id],
    );

    sendSuccess(res, 201, 'Disaster reported', result.rows[0]);
  } catch (err) {
    console.error('Create Disaster Error:', err);
    sendError(res, 500, err.message);
  }
};

// --- UPDATE DISASTER ---
export const updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, severity, latitude, longitude } = req.body;

    const check = await query('SELECT * FROM disasters WHERE id = $1', [id]);
    if (check.rows.length === 0) return sendError(res, 404, 'Disaster not found');

    const oldData = check.rows[0];
    let event_image = oldData.event_image;

    if (req.file) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'disasters');
      ensureDirectoryExists(uploadDir);

      if (oldData.event_image) deleteFileFromStorage(oldData.event_image);
      event_image = `http://localhost:4000/uploads/disasters/${req.file.filename}`;
    }

    const result = await query(
      `UPDATE disasters 
       SET title = $1, description = $2, severity = $3, latitude = $4, longitude = $5, event_image = $6
       WHERE id = $7 RETURNING *`,
      [
        title || oldData.title,
        description || oldData.description,
        severity || oldData.severity,
        latitude || oldData.latitude,
        longitude || oldData.longitude,
        event_image,
        id,
      ],
    );

    sendSuccess(res, 200, 'Disaster updated', result.rows[0]);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// --- DELETE DISASTER ---
export const deleteDisaster = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await query('SELECT event_image FROM disasters WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      if (result.rows[0].event_image) {
        deleteFileFromStorage(result.rows[0].event_image);
      }

      await query('DELETE FROM disasters WHERE id = $1', [id]);
      sendSuccess(response, 200, 'Disaster report and image removed');
    } else {
      sendError(response, 404, 'Disaster not found');
    }
  } catch (err) {
    sendError(response, 500, err.message);
  }
};
