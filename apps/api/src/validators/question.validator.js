import { body, param } from 'express-validator';

export const questionIdRules = [param('id').isMongoId().withMessage('Valid id is required')];

export const questionRules = [
    body('type')
        .isIn(['single_correct_mcq', 'multiple_correct_mcq', 'true_false', 'integer', 'fill_blank', 'paragraph'])
        .withMessage('Valid question type is required'),
    body('exam').isMongoId().withMessage('Valid exam id is required'),
    body('subject').isMongoId().withMessage('Valid subject id is required'),
    body('topic').isMongoId().withMessage('Valid topic id is required'),
    body('subTopic').isMongoId().withMessage('Valid subTopic id is required'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Valid difficulty is required'),
    body('language').optional().isString().isLength({ min: 2, max: 12 }),
    body('prompt').trim().isLength({ min: 3, max: 10000 }).withMessage('Prompt is required'),
    body('status').optional().isIn(['draft', 'published', 'archived']),
    body('options').optional().isArray(),
    body('tags').optional().isArray(),
];