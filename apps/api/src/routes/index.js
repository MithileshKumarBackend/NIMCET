import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { health } from '../controllers/health.controller.js';
const router = Router();
router.get('/health', health);
router.use('/auth', authRoutes);
export default router;
