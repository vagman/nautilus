import fs from 'fs';
import { query } from './database.js';
import process from 'process';

const sql = fs.readFileSync('./schema.sql', 'utf8');

async function initializeDatabase() {
  try {
    await query(sql);
    console.log('✅ Tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    process.exit(1);
  }
}

initializeDatabase();
