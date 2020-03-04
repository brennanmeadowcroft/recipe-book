const bunyan = require("bunyan");

const logLevel = process.env.LOG_LEVEL || "info";
const logger = bunyan.createLogger({ name: "recipe-book", level: logLevel });

module.exports = logger;
