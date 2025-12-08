const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (payload, options = {}) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: '2d', ...options });

const verifyToken = (token) => jwt.verify(token, config.jwtSecret);

module.exports = {
  generateToken,
  verifyToken
};
