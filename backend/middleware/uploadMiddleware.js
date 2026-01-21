import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper function to create storage engine and ensure folder exists
const createStorage = folderName => {
  const targetDir = `uploads/${folderName}/`;

  // Create folder if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, targetDir);
    },
    filename(req, file, cb) {
      // Use a clean format: disaster-1705700000.jpg
      cb(null, `${folderName}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
};

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

// 1. Storage for Volunteer Events
export const uploadVolunteer = multer({
  storage: createStorage('volunteer_events'),
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

// 2. Storage for User Profiles
export const uploadProfile = multer({
  storage: createStorage('profiles'),
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

// 3. NEW: Storage for Disaster Reports
export const uploadDisaster = multer({
  storage: createStorage('disasters'),
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});
