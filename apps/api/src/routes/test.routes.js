import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { testController } from '../controllers/test.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { testIdRules, testRules } from '../validators/test.validator.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testController.list);
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testRules, validate, testController.create);
router.get('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testIdRules, validate, testController.getById);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testIdRules, testRules, validate, testController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testIdRules, validate, testController.remove);
router.post('/:id/restore', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testIdRules, validate, testController.restore);
router.post('/:id/clone', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), testIdRules, validate, testController.clone);

export default router;