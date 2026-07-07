import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../configs/env.js';

export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const randomToken = (bytes = 48) => crypto.randomBytes(bytes).toString('hex');

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, tokenVersion: user.tokenVersion || 0 },
    env.accessSecret,
    { expiresIn: env.accessTtl, issuer: 'nimcet-api', audience: 'nimcet-web' },
  );
}

export function signRefreshToken(user, jti) {
  return jwt.sign(
    { sub: user.id, jti, tokenVersion: user.tokenVersion || 0 },
    env.refreshSecret,
    { expiresIn: `${env.refreshDays}d`, issuer: 'nimcet-api', audience: 'nimcet-web' },
  );
}

export function verifyAccess(token) {
  return jwt.verify(token, env.accessSecret, { issuer: 'nimcet-api', audience: 'nimcet-web' });
}

export function verifyRefresh(token) {
  return jwt.verify(token, env.refreshSecret, { issuer: 'nimcet-api', audience: 'nimcet-web' });
}

export function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
