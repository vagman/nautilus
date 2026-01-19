import multer from 'multer';
import path from 'path';

// Helper function to create storage engine
const createStorage = folderName => {
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `uploads/${folderName}/`);
    },
    filename(req, file, cb) {
      // filename: fieldname-userid-timestamp.jpg
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
};

// Check file type (Images only)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

export const uploadVolunteer = multer({
  storage: createStorage('volunteer'),
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

export const uploadProfile = multer({
  storage: createStorage('profiles'),
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});
