const Joi = require("@hapi/joi");
const log = require("../lib/logger");
const { AlreadyExistsError, NotFoundError } = require("../lib/errors");

function Mock(options = {}) {
  const logger = options.logger || log;
  let currentMocks = {};

  const schema = Joi.object({
    name: Joi.string().required(),
    request: {
      path: Joi.string().required(),
      method: Joi.string()
        .uppercase()
        .allow("GET", "PUT", "PATCH", "POST", "DELETE")
    },
    response: {
      body: Joi.object().default({}),
      headers: Joi.object(),
      statusCode: Joi.number()
        .greater(199)
        .less(600)
        .required()
    }
  });

  function add(mock) {
    if (Array.isArray(mock)) {
      logger.debug("Provided mock is array");
    }
    const mockArray = Array.isArray(mock) ? mock : [mock];

    mockArray.forEach(m => {
      const { request } = m;

      const alreadyExists = find(request);
      if (alreadyExists) {
        logger.warn({ mock: m, found: alreadyExists }, "Already exists");
        throw new AlreadyExistsError("Mock already exists");
      } else {
        logger.debug("Provided mock does not yet exist");
        const validated = _validate(m);
        logger.debug("Provided mock is valid");

        const key = _generateKey(validated.request);
        currentMocks[key] = m;
        logger.debug("Mock saved", { key, mock: validated });
      }
    });
  }

  function all() {
    const formatted = Object.keys(currentMocks).map(mock => {
      return currentMocks[mock];
    });

    return formatted;
  }

  function clear() {
    currentMocks = {};
  }

  function find(request) {
    logger.info({ request }, "Seeking mock");
    const key = _generateKey(request);
    const result = currentMocks[key];
    if (!result) {
      logger.warn("Mock not found");
    }

    return result;
  }

  function _validate(mock) {
    const { error, value } = schema.validate(mock);

    if (error) {
      throw error;
    }

    return value;
  }

  function _generateKey(request) {
    return `${request.path}__${request.method}`;
  }

  let exports = {
    add,
    all,
    clear,
    find
  };

  if (process.env.NODE_ENV === "test") {
    // Enables unit testing to confirm the correct transformations
    exports.currentMocks = currentMocks;
  }
  return exports;
}

module.exports = Mock;
