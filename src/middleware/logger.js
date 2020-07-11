const logger = require("../lib/logger");

function loggerMiddleware(req, res, next) {
  req.logger = logger;
  next();
}

module.exports = loggerMiddleware;
