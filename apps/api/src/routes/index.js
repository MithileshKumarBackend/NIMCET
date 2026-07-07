import { Router } from 'express';
import authRoutes from './auth.routes.js';
import uploadRoutes from './upload.routes.js';
import { health } from '../controllers/health.controller.js';
const router = Router();
router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
export default router;
