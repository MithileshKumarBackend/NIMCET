import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { uploadQuestionImage } from '../controllers/upload.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { imageUpload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/question-image', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), imageUpload.single('image'), uploadQuestionImage);

export default router;
