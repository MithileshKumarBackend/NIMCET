import * as authService from '../services/auth.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clearRefreshCookie, refreshCookieName, setRefreshCookie } from '../utils/cookies.js';

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    avatar: user.avatar,
  };
}

function sendSession(res, result, message, status = 200) {
  setRefreshCookie(res, result.refreshToken);
  return ok(res, { user: result.user, accessToken: result.accessToken }, message, status);
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, req);
  return sendSession(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);
  return sendSession(res, result, 'Login successful');
});

export const googleLogin = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.body, req);
  return sendSession(res, result, 'Google login successful');
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.cookies[refreshCookieName], req);
  return sendSession(res, result, 'Token refreshed');
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body.token, req);
  return ok(res, null, 'Email verified');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email, req);
  return ok(res, null, 'If that email exists, reset instructions were sent');
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password, req);
  clearRefreshCookie(res);
  return ok(res, null, 'Password reset successful');
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies[refreshCookieName], req);
  clearRefreshCookie(res);
  return ok(res, null, 'Logged out');
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id, req);
  clearRefreshCookie(res);
  return ok(res, null, 'Logged out from all devices');
});

export const me = asyncHandler(async (req, res) => ok(res, { user: safeUser(req.user) }));
