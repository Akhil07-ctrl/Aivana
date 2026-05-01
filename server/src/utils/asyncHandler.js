// Wraps async route handlers to avoid repetitive try/catch
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;
