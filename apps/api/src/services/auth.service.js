import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../utils/AppError.js';
import { addDays, randomToken, sha256, signAccessToken, signRefreshToken, verifyRefresh } from '../utils/tokens.js';
import { RefreshToken, VerificationToken } from '../models/token.model.js';
import { userRepository } from '../repositories/user.repository.js';
import { env } from '../configs/env.js';
import { sendMail } from './mail.service.js';
import { audit } from './audit.service.js';

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
  };
}

export async function issueTokenPair(user, req, family = crypto.randomUUID()) {
  const jti = crypto.randomUUID();
  const refreshToken = signRefreshToken(user, jti);

  await RefreshToken.create({
    user: user.id,
    jti,
    tokenHash: sha256(refreshToken),
    family,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    expiresAt: addDays(env.refreshDays),
  });

  return { accessToken: signAccessToken(user), refreshToken };
}

async function createVerificationToken(user, purpose, ttlMinutes = 60) {
  const token = randomToken();
  await VerificationToken.create({
    user: user.id,
    tokenHash: sha256(token),
    purpose,
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
  });
  return token;
}

export async function register(payload, req) {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');

  const user = await userRepository.create({
    name: payload.name,
    email: payload.email,
    role: 'student',
    provider: 'email',
  });
  await user.setPassword(payload.password);
  await user.save();

  const token = await createVerificationToken(user, 'email_verification');
  await sendMail({ to: user.email, subject: 'Verify your email', html: `Verification token: ${token}` });
  await audit({ req, actor: user.id, action: 'auth.register', entity: 'User', entityId: user.id });

  const pair = await issueTokenPair(user, req);
  return { user: sanitizeUser(user), ...pair };
}

export async function login({ email, password }, req) {
  const user = await userRepository.findByEmailWithPassword(email);

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) throw new AppError('Account disabled', 403, 'ACCOUNT_DISABLED');

  await audit({ req, actor: user.id, action: 'auth.login', entity: 'User', entityId: user.id });
  const pair = await issueTokenPair(user, req);
  return { user: sanitizeUser(user), ...pair };
}

export async function googleLogin({ idToken }, req) {
  if (!googleClient) throw new AppError('Google login is not configured', 503, 'GOOGLE_NOT_CONFIGURED');

  const ticket = await googleClient.verifyIdToken({ idToken, audience: env.googleClientId });
  const profile = ticket.getPayload();

  if (!profile?.email_verified) {
    throw new AppError('Google email is not verified', 401, 'GOOGLE_EMAIL_UNVERIFIED');
  }

  let user = await userRepository.findByEmail(profile.email);
  if (!user) {
    user = await userRepository.create({
      name: profile.name || profile.email.split('@')[0],
      email: profile.email,
      role: 'student',
      provider: 'google',
      googleId: profile.sub,
      isEmailVerified: true,
      avatar: profile.picture ? { url: profile.picture } : undefined,
    });
  } else if (!user.googleId) {
    user.googleId = profile.sub;
    user.isEmailVerified = true;
    await user.save();
  }

  await audit({ req, actor: user.id, action: 'auth.google_login', entity: 'User', entityId: user.id });
  const pair = await issueTokenPair(user, req);
  return { user: sanitizeUser(user), ...pair };
}

export async function refresh(rawToken, req) {
  if (!rawToken) throw new AppError('Missing refresh token', 401, 'MISSING_REFRESH');

  const payload = verifyRefresh(rawToken);
  const stored = await RefreshToken.findOne({ jti: payload.jti, tokenHash: sha256(rawToken) });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    if (stored?.family) {
      await RefreshToken.updateMany({ family: stored.family, revokedAt: null }, { revokedAt: new Date() });
    }
    throw new AppError('Refresh token revoked or expired', 401, 'REFRESH_REVOKED');
  }

  const user = await userRepository.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new AppError('User session is no longer valid', 401, 'SESSION_INVALID');
  }

  const nextJti = crypto.randomUUID();
  stored.revokedAt = new Date();
  stored.replacedBy = nextJti;
  await stored.save();

  const refreshToken = signRefreshToken(user, nextJti);
  await RefreshToken.create({
    user: user.id,
    jti: nextJti,
    tokenHash: sha256(refreshToken),
    family: stored.family,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    expiresAt: addDays(env.refreshDays),
  });

  return { user: sanitizeUser(user), accessToken: signAccessToken(user), refreshToken };
}

export async function verifyEmail(token, req) {
  const doc = await VerificationToken.findOne({ tokenHash: sha256(token), purpose: 'email_verification', usedAt: null });
  if (!doc || doc.expiresAt < new Date()) throw new AppError('Invalid verification token', 400, 'INVALID_TOKEN');

  await userRepository.updateById(doc.user, { isEmailVerified: true });
  doc.usedAt = new Date();
  await doc.save();
  await audit({ req, actor: doc.user, action: 'auth.verify_email', entity: 'User', entityId: doc.user });
}

export async function forgotPassword(email, req) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;

  const token = await createVerificationToken(user, 'password_reset', 30);
  await sendMail({ to: user.email, subject: 'Reset your password', html: `Reset token: ${token}` });
  await audit({ req, actor: user.id, action: 'auth.forgot_password', entity: 'User', entityId: user.id });
}

export async function resetPassword(token, password, req) {
  const doc = await VerificationToken.findOne({ tokenHash: sha256(token), purpose: 'password_reset', usedAt: null });
  if (!doc || doc.expiresAt < new Date()) throw new AppError('Invalid reset token', 400, 'INVALID_TOKEN');

  const user = await userRepository.findById(doc.user);
  await user.setPassword(password);
  user.tokenVersion += 1;
  await user.save();

  doc.usedAt = new Date();
  await doc.save();
  await RefreshToken.updateMany({ user: user.id, revokedAt: null }, { revokedAt: new Date() });
  await audit({ req, actor: user.id, action: 'auth.reset_password', entity: 'User', entityId: user.id });
}

export async function logout(rawToken, req) {
  if (!rawToken) return;
  const stored = await RefreshToken.findOneAndUpdate(
    { tokenHash: sha256(rawToken), revokedAt: null },
    { revokedAt: new Date() },
    { new: true },
  );
  if (stored) await audit({ req, actor: stored.user, action: 'auth.logout', entity: 'User', entityId: stored.user });
}

export async function logoutAll(userId, req) {
  await RefreshToken.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });
  await userRepository.incrementTokenVersion(userId);
  await audit({ req, actor: userId, action: 'auth.logout_all', entity: 'User', entityId: userId });
}
