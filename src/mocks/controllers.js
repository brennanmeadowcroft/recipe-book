const { NotFoundError } = require("../lib/errors");
const Mock = require("../models/Mock");

function MockController(mock) {
  function add(req, res) {
    const body = req.body;

    mock.add(body.data);
    res.status(201).send("CREATED");
  }

  function list(req, res) {
    const data = mock.all();
    res.status(200).send(data);
  }

  function clear(req, res) {
    mock.clear();
    res.status(200).send("DELETED");
  }

  function find(req, res) {
    const request = {
      path: req.originalUrl,
      method: req.method,
      headers: req.headers
    };

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
    res.status(found.response.statusCode).send(found.response.body);
  }

  return {
    add,
    find,
    list,
    clear
  };
}

module.exports = MockController;
