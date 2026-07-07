import { env } from '../configs/env.js';

export const refreshCookieName = 'nimcet_refresh';
export const csrfCookieName = 'nimcet_csrf';

const commonCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  domain: env.isProd ? env.cookieDomain : undefined,
  path: '/api/v1/auth',
};

export function setRefreshCookie(res, token) {
  res.cookie(refreshCookieName, token, {
    ...commonCookieOptions,
    maxAge: env.refreshDays * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(refreshCookieName, commonCookieOptions);
}
