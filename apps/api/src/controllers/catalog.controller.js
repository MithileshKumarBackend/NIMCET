import { Exam, Subject, Topic, SubTopic } from '../models/catalog.model.js';
import { createCrudController } from './crud.controller.js';
import { slugify } from '../utils/slug.js';

function createCatalogController(model, parentField) {
    return createCrudController({
        model,
        resourceName: model.modelName,
        searchFields: ['name', 'description', 'slug'],
        buildFilter: (req) => {
            const filter = {};

            if (parentField && req.query[parentField]) {
                filter[parentField] = req.query[parentField];
            }

            return filter;
        },
        transformCreate: (data, req) => ({
            ...data,
            slug: data.slug || slugify(data.name),
            createdBy: req.user?.id,
            updatedBy: req.user?.id,
        }),
        transformUpdate: (data, req) => ({
            ...data,
            ...(data.name && !data.slug ? { slug: slugify(data.name) } : {}),
            updatedBy: req.user?.id,
        }),
        transformClone: (data, req) => ({
            ...data,
            name: `${data.name} Copy`,
            slug: `${slugify(data.name)}-copy`,
            deletedAt: null,
            createdBy: req.user?.id,
            updatedBy: req.user?.id,
        }),
    });
}

export const examController = createCatalogController(Exam);
export const subjectController = createCatalogController(Subject, 'exam');
export const topicController = createCatalogController(Topic, 'subject');
export const subTopicController = createCatalogController(SubTopic, 'topic');

export const catalogController = {
    examController,
    subjectController,
    topicController,
    subTopicController,
};