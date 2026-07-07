import { Test } from '../models/test.model.js';
import { createCrudController } from './crud.controller.js';

export const testController = createCrudController({
    model: Test,
    resourceName: 'Test',
    searchFields: ['title', 'description', 'instructions'],
    populate: ['exam', 'subject', 'sections.questions', 'createdBy', 'updatedBy'],
    buildFilter: (req) => {
        const filter = {};

        for (const field of ['exam', 'subject', 'status']) {
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
        title: `${data.title} Copy`,
        status: 'draft',
        deletedAt: null,
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
    }),
});