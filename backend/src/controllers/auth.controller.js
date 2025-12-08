const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email already in use', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken({ id: user._id });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: buildUserPayload(user)
    }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken({ id: user._id });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: buildUserPayload(user)
    }
  });
});
