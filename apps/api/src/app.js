import express from 'express';
import { applySecurity } from './middlewares/security.middleware.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
export function createApp() { const app = express(); applySecurity(app); app.use('/api/v1', routes); app.use(notFound); app.use(errorHandler); return app; }
