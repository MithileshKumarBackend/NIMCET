export function ok(res, data = null, message = 'OK', statusCode = 200, meta = undefined) {
  return res.status(statusCode).json({ success: true, message, data, meta });
}

export function created(res, data, message = 'Created') {
  return ok(res, data, message, 201);
}

export function noContent(res) {
  return res.status(204).send();
}

export function paginationMeta({ page, limit, total }) {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
