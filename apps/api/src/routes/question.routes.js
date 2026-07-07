import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { questionController } from '../controllers/question.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { questionIdRules, questionRules } from '../validators/question.validator.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionController.list);
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionRules, validate, questionController.create);
router.get('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionIdRules, validate, questionController.getById);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionIdRules, questionRules, validate, questionController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionIdRules, validate, questionController.remove);
router.post('/:id/restore', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionIdRules, validate, questionController.restore);
router.post('/:id/clone', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), questionIdRules, validate, questionController.clone);

export default router;