const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

const auth = (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }

    const token = header.replace('Bearer ', '').trim();
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = auth;
