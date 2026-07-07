import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { catalogController } from '../controllers/catalog.controller.js';
import { examRules, mongoIdParam, subTopicRules, subjectRules, topicRules } from '../validators/catalog.validator.js';

const router = Router();

function mountResource(path, controller, createRules, updateRules) {
    router.get(`/${path}`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), controller.list);
    router.post(`/${path}`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), createRules, validate, controller.create);
    router.get(`/${path}/:id`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), mongoIdParam, validate, controller.getById);
    router.patch(`/${path}/:id`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), mongoIdParam, updateRules, validate, controller.update);
    router.delete(`/${path}/:id`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), mongoIdParam, validate, controller.remove);
    router.post(`/${path}/:id/restore`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), mongoIdParam, validate, controller.restore);
    router.post(`/${path}/:id/clone`, authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), mongoIdParam, validate, controller.clone);
}

const { examController, subjectController, topicController, subTopicController } = catalogController;

mountResource('exams', examController, examRules, examRules);
mountResource('subjects', subjectController, subjectRules, subjectRules);
mountResource('topics', topicController, topicRules, topicRules);
mountResource('subtopics', subTopicController, subTopicRules, subTopicRules);

export default router;