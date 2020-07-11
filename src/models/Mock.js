const Joi = require("@hapi/joi");
const log = require("../lib/logger");
const { AlreadyExistsError, NotFoundError } = require("../lib/errors");

function Mock(options = {}) {
  const logger = options.logger || log;
  let currentMocks = {};

  const responseBodySchema = {
    body: Joi.alternatives().try(Joi.object(), Joi.array()).default({}),
    headers: Joi.object(),
    statusCode: Joi.number().greater(199).less(600).required(),
    timeout: Joi.number().default(0),
  };

  const schema = Joi.object({
    name: Joi.string().required(),
    request: {
      path: Joi.string().required(),
      method: Joi.string()
        .uppercase()
        .allow("GET", "PUT", "PATCH", "POST", "DELETE"),
    },
    response: Joi.alternatives()
      .try(
        Joi.object(responseBodySchema),
        Joi.array().items(responseBodySchema)
      )
      .required(),
  });

  function add(mock) {
    logger.info({ mock }, "Mock received");
    if (Array.isArray(mock)) {
      logger.debug("Provided mock is array.  Saving all responses.");
    }
    const mockArray = Array.isArray(mock) ? mock : [mock];

    mockArray.forEach(m => {
      const { request } = m;

      const alreadyExists = _locate(request);
      if (alreadyExists) {
        logger.warn({ mock: m, found: alreadyExists }, "Already exists");
        throw new AlreadyExistsError("Mock already exists");
      } else {
        logger.debug("Provided mock does not yet exist");
        const validated = _validate(m);
        logger.debug("Provided mock is valid");

        const key = _generateKey(validated.request);
        currentMocks[key] = m;
        logger.info({ key, mock: validated }, "Mock saved");
      }
    });
  }

  function all() {
    const formatted = Object.keys(currentMocks).map(mock => {
      return currentMocks[mock];
    });
    logger.debug({ count: formatted.length }, "All mocks available");

    return formatted;
  }

  function clear() {
    logger.debug("Seeing current mocks = {}");
    currentMocks = {};
  }

  function find(request) {
    const result = _locate(request);
    if (!result) {
      logger.debug({ result, request }, "No result found");
      return;
    }

    logger.info({ result }, "Found result");
    const parsedResult = _parseFromResponseArray(result);

    return parsedResult;
  }

  function _parseFromResponseArray(result) {
    if (!Array.isArray(result.response)) {
      logger.debug(
        { response: result.response },
        "Response is not in the form of an array"
      );
      return result;
    }

    if (result.response.length === 0) {
      throw new NotFoundError(
        "Response found but response is empty. Perhaps there are no more responses in the sequence?"
      );
    }

    // Pop index 0 and return it
    logger.info("Response is an array.  Taking first result");
    const parsed = { ...result };
    delete parsed.response;
    parsed.response = result.response.shift();

    return parsed;
  }

  function _locate(request) {
    logger.debug({ request }, "Locating mock");
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
    find,
    _parseFromResponseArray,
  };

  if (process.env.NODE_ENV === "test") {
    // Enables unit testing to confirm the correct transformations
    exports.currentMocks = currentMocks;
  }
  return exports;
}

module.exports = Mock;
