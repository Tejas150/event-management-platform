const createError = require('http-errors');

/**
 * authorize based on user roles
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user; // Assuming `req.user` is populated by `authenticate` middleware
      if (!allowedRoles.includes(role)) {
        throw createError(403, 'Access denied. Insufficient permissions');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeRole;
