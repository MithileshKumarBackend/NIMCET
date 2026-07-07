import { Question } from '../models/question.model.js';
import { createCrudController } from './crud.controller.js';

export const questionController = createCrudController({
    model: Question,
    resourceName: 'Question',
    searchFields: ['prompt', 'explanation', 'solution', 'tags'],
    populate: ['exam', 'subject', 'topic', 'subTopic', 'createdBy', 'updatedBy'],
    buildFilter: (req) => {
        const filter = {};

        for (const field of ['exam', 'subject', 'topic', 'subTopic', 'difficulty', 'language', 'type', 'status']) {
            if (req.query[field]) {
                filter[field] = req.query[field];
            }
        }

        return filter;
    },
    transformCreate: (data, req) => ({
        ...data,
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
    }),
    transformUpdate: (data, req) => ({
        ...data,
        updatedBy: req.user?.id,
    }),
    transformClone: (data, req) => ({
        ...data,
        prompt: `${data.prompt} (Copy)`,
        status: 'draft',
        clonedFrom: data._id,
        deletedAt: null,
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
    }),
});