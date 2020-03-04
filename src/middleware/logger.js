const logger = require("../lib/logger");

const loggerMiddleware = (err, req, res, next) => {
  req.logger = logger;
  next();
};

module.exports = loggerMiddleware;
