import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../configs/env.js';
export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const randomToken = () => crypto.randomBytes(48).toString('hex');
export function signAccessToken(user) { return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.accessSecret, { expiresIn: env.accessTtl }); }
export function signRefreshToken(user, jti) { return jwt.sign({ sub: user.id, jti }, env.refreshSecret, { expiresIn: `${env.refreshDays}d` }); }
export function verifyAccess(token) { return jwt.verify(token, env.accessSecret); }
export function verifyRefresh(token) { return jwt.verify(token, env.refreshSecret); }
export function addDays(days) { const d = new Date(); d.setDate(d.getDate() + days); return d; }
