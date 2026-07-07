export function ok(res, data = null, message = 'OK', statusCode = 200, meta = undefined) {
  return res.status(statusCode).json({ success: true, message, data, meta });
}
export function created(res, data, message = 'Created') { return ok(res, data, message, 201); }
