import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isStrongPassword({ minLength: 8 }).withMessage('Password must be strong and at least 8 characters'),
];

export const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const googleLoginRules = [body('idToken').isJWT().withMessage('Google ID token is required')];
export const emailRules = [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')];
export const resetRules = [body('token').isString().isLength({ min: 32 }), body('password').isStrongPassword({ minLength: 8 })];
export const verifyEmailRules = [body('token').isString().isLength({ min: 32 })];
