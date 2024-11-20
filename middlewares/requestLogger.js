const logger = require('../utils/logger'); // Import the logger utility (Winston)

const requestLogger = (req, res, next) => {
  const { method, url, headers, ip } = req;

  // Log the HTTP request details (method, url, headers, ip)
  logger.info(`[${method}] ${url} - Headers: ${JSON.stringify(headers)} - Ip: ${ip}`);

  next();
};

module.exports = requestLogger;
