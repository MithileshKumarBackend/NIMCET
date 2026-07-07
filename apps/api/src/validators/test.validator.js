import { body, param } from 'express-validator';

export const testIdRules = [param('id').isMongoId().withMessage('Valid id is required')];

export const testRules = [
    body('exam').isMongoId().withMessage('Valid exam id is required'),
    body('subject').isMongoId().withMessage('Valid subject id is required'),
    body('title').trim().isLength({ min: 3, max: 180 }).withMessage('Title is required'),
    body('sections').optional().isArray().withMessage('Sections must be an array'),
    body('status').optional().isIn(['draft', 'published', 'archived']),
];