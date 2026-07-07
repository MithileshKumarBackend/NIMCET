import { ok } from '../utils/apiResponse.js';
export const health = (req, res) => ok(res, { uptime: process.uptime(), timestamp: new Date().toISOString() }, 'Healthy');
