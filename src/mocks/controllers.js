const { NotFoundError } = require("../lib/errors");
const Mock = require("../models/Mock");

function MockController(mock) {
  function add(req, res) {
    const body = req.body;
    req.logger.debug({ mock: body }, "Mock submitted to add");

    mock.add(body.data);
    res.status(201).send("CREATED");
  }

  function list(req, res) {
    req.logger.debug("Listing all mocks");
    const data = mock.all();
    res.status(200).send(data);
  }

  function clear(req, res) {
    req.logger.debug("Deleting all mocks from memory");
    mock.clear();
    res.status(200).send("DELETED");
  }

  function find(req, res) {
    const request = {
      path: req.originalUrl,
      method: req.method,
      headers: req.headers,
    };
    req.logger.debug({ request }, "Searching for requested mock");

    const found = mock.find(request);
    if (!found) {
      req.logger.info(
        { request },
        "No matching mock found, throwing NotFoundError"
      );
      throw new NotFoundError(
        `${request.method} ${request.path} mock not found`
      );
    }
    req.logger.debug("Mock found", { found });
    const DEFAULT_WAIT_MS = 0;
    const waitMs = found.response.timeout || DEFAULT_WAIT_MS;

    setTimeout(() => {
      res.status(found.response.statusCode).send(found.response.body);
    }, waitMs);
  }

  return {
    add,
    find,
    list,
    clear,
  };
}

module.exports = MockController;
