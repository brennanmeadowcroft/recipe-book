const { expect } = require("chai");
const sinon = require("sinon");
const errorHandler = require("../../middleware/errorHandler");

let fakeSend;
let res;
let req;
let sandbox;
let logger;

const errors = [
  {
    type: "AlreadyExistsError",
    expectedStatusCode: 409,
    error: {
      name: "AlreadyExistsError",
      message: "That already Exists!"
    }
  },
  {
    type: "NotFoundError",
    expectedStatusCode: 404,
    error: {
      name: "NotFoundError",
      message: "That does not exist!"
    }
  },
  {
    type: "ValidationError",
    expectedStatusCode: 400,
    error: {
      name: "ValidationError",
      message: "That cannot exist!"
    }
  },
  {
    type: "type not specifically handled",
    expectedStatusCode: 500,
    expectedErrorName: "UnspecifiedError",
    error: {
      name: "UnknownError",
      message: "I've never seen that before!"
    }
  }
];

describe("errorHandler", function() {
  beforeEach(function() {
    sandbox = sinon.createSandbox();

    fakeSend = {
      json: sandbox.mock()
    };

    res = {
      status: sandbox.mock().returns(fakeSend)
    };

    req = {
      logger: {
        error: sandbox.mock()
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  errors.forEach(err => {
    describe(`when error is a ${err.type}`, function() {
      it("should return the correct response", function() {
        errorHandler(err.error, req, res);

        expect(res.status.args[0][0]).to.eq(err.expectedStatusCode);
        const expectedError = err.expectedErrorName || err.error.name;
        expect(fakeSend.json.args[0][0]).to.deep.eq({
          error: err.error.name,
          message: err.error.message
        });
      });

      it("should log a message", function() {
        errorHandler(err.error, req, res);
        expect(req.logger.error.args[0][0]).to.have.keys(["error", "request"]);
        expect(req.logger.error.args[0][1]).to.eq(
          `${err.error.name} received from a route`
        );
      });
    });
  });
});
