import { env } from '../configs/env.js';
export const refreshCookieName = 'nimcet_refresh';
export function setRefreshCookie(res, token) {
  res.cookie(refreshCookieName, token, { httpOnly: true, secure: env.isProd, sameSite: env.isProd ? 'none' : 'lax', domain: env.isProd ? env.cookieDomain : undefined, maxAge: env.refreshDays * 86400000, path: '/api/v1/auth' });
}
export function clearRefreshCookie(res) { res.clearCookie(refreshCookieName, { path: '/api/v1/auth' }); }
