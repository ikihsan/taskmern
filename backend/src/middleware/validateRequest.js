const AppError = require('../utils/AppError');

const validateRequest = (schema, property = 'body') => (req, res, next) => {
  const data = req[property];
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    return next(new AppError('Validation failed', 400, issues));
  }

  req[property] = result.data;
  return next();
};

module.exports = validateRequest;
