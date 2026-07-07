export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
  };

  if (!err.isOperational || statusCode >= 500) {
    console.error({ message: err.message, stack: err.stack, path: req.originalUrl });
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}
