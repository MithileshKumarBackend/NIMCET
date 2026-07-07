import { created, noContent, ok, paginationMeta } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function buildSearchFilter(searchFields, search) {
    if (!search || !searchFields?.length) {
        return {};
    }

    return {
        $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
        })),
    };
}

function safeBoolean(value) {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return undefined;
}

function toPlainObject(doc) {
    return JSON.parse(JSON.stringify(doc.toObject({ virtuals: true })));
}

export function createCrudController({
    model,
    resourceName,
    searchFields = [],
    populate = [],
    buildFilter = () => ({}),
    transformCreate = (data) => data,
    transformUpdate = (data) => data,
    transformClone = (data) => data,
}) {
    const applyPopulate = (query) => {
        for (const entry of populate) {
            query.populate(entry);
        }
        return query;
    };

    return {
        list: asyncHandler(async (req, res) => {
            const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
            const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
            const skip = (page - 1) * limit;
            const search = String(req.query.search || '').trim();
            const sort = String(req.query.sort || '-createdAt');
            const includeDeleted = safeBoolean(req.query.deleted) === true;
            const filter = {
                ...buildFilter(req),
                ...(includeDeleted ? {} : { deletedAt: null }),
                ...buildSearchFilter(searchFields, search),
            };

            if (req.query.status) {
                filter.status = req.query.status;
            }

            if (req.query.isActive !== undefined) {
                const parsed = safeBoolean(req.query.isActive);
                if (parsed !== undefined) {
                    filter.isActive = parsed;
                }
            }

            const [items, total] = await Promise.all([
                applyPopulate(model.find(filter).sort(sort).skip(skip).limit(limit)),
                model.countDocuments(filter),
            ]);

            return ok(
                res,
                { items },
                `${resourceName} list fetched`,
                200,
                paginationMeta({ page, limit, total }),
            );
        }),

        getById: asyncHandler(async (req, res) => {
            const includeDeleted = safeBoolean(req.query.deleted) === true;
            const filter = { _id: req.params.id, ...(includeDeleted ? {} : { deletedAt: null }) };
            const item = await applyPopulate(model.findOne(filter));

            if (!item) {
                throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
            }

            return ok(res, { item }, `${resourceName} fetched`);
        }),

        create: asyncHandler(async (req, res) => {
            const payload = transformCreate(req.body, req);
            const item = await model.create(payload);
            return created(res, { item }, `${resourceName} created`);
        }),

        update: asyncHandler(async (req, res) => {
            const payload = transformUpdate(req.body, req);
            const item = await applyPopulate(
                model.findOneAndUpdate(
                    { _id: req.params.id, deletedAt: null },
                    payload,
                    { new: true, runValidators: true },
                ),
            );

            if (!item) {
                throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
            }

            return ok(res, { item }, `${resourceName} updated`);
        }),

        remove: asyncHandler(async (req, res) => {
            const item = await model.findOneAndUpdate(
                { _id: req.params.id, deletedAt: null },
                { deletedAt: new Date(), updatedBy: req.user?.id },
                { new: true },
            );

            if (!item) {
                throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
            }

            return noContent(res);
        }),

        restore: asyncHandler(async (req, res) => {
            const item = await model.findOneAndUpdate(
                { _id: req.params.id, deletedAt: { $ne: null } },
                { deletedAt: null, updatedBy: req.user?.id },
                { new: true },
            );

            if (!item) {
                throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
            }

            return ok(res, { item }, `${resourceName} restored`);
        }),

        clone: asyncHandler(async (req, res) => {
            const source = await model.findOne({ _id: req.params.id, deletedAt: null });

            if (!source) {
                throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
            }

            const plain = toPlainObject(source);
            const payload = transformClone(plain, req);
            const item = await model.create(payload);

            return created(res, { item }, `${resourceName} cloned`);
        }),
    };
}