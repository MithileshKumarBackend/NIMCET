import { body } from 'express-validator';
export const registerRules = [body('name').trim().isLength({ min: 2, max: 120 }), body('email').isEmail().normalizeEmail(), body('password').isStrongPassword({ minLength: 8 })];
export const loginRules = [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()];
export const emailRules = [body('email').isEmail().normalizeEmail()];
export const resetRules = [body('token').isString().isLength({ min: 32 }), body('password').isStrongPassword({ minLength: 8 })];
export const verifyEmailRules = [body('token').isString().isLength({ min: 32 })];
