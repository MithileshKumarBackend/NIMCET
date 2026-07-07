import { body, param } from 'express-validator';

export const mongoIdParam = [param('id').isMongoId().withMessage('Valid id is required')];

const baseRules = [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
    body('description').optional({ nullable: true }).isString().isLength({ max: 2000 }),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

export const examRules = baseRules;
export const subjectRules = [...baseRules, body('exam').isMongoId().withMessage('Valid exam id is required')];
export const topicRules = [...baseRules, body('subject').isMongoId().withMessage('Valid subject id is required')];
export const subTopicRules = [...baseRules, body('topic').isMongoId().withMessage('Valid topic id is required')];