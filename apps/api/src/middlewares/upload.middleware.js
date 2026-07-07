import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter(req, file, cb) {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new AppError('Only jpeg, png, webp, and gif images are allowed', 415, 'UNSUPPORTED_FILE_TYPE'));
    }
    return cb(null, true);
  },
});
