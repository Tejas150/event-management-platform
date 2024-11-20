const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/env')

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError(401, 'Access token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, 'Invalid or expired token'));
  }
};

module.exports = authenticate;
