const { expect } = require("chai");
const { validMock } = require("../helpers/fixtures");
const Mock = require("../../models/Mock");

let mock;
const expectedKey = `${validMock.request.path}__${validMock.request.method}`;

describe("Mock", function() {
  // Enables export of `currentMocks` object for unit testing
  process.env.NODE_ENV = "test";

  describe("#add", function() {
    it("should validate the mock before saving", function() {});

    describe("when provided with a valid mock", function() {
      mock = new Mock();
      mock.add(validMock);

      it("should add it to the available mocks", function() {
        const mocks = mock.currentMocks;
        expect(Object.keys(mocks)).to.have.length(1);
      });

      it("should set the key to the correct value", function() {
        const mocks = mock.currentMocks;
        expect(mocks).to.have.key(expectedKey);
      });

      it("should store the mock under the correct key", function() {
        const mocks = mock.currentMocks;
        expect(mocks[expectedKey]).to.deep.eq(validMock);
      });
    });

    describe("when provided with an invalid mock", function() {
      let invalidData = {
        name: "Invalid Data",
        request: {
          path: "/invalid",
          method: "GET"
        },
        response: {
          body: {},
          statusCode: 400,
          headers: {}
        }
      };
      describe("due to missing request.path", function() {
        it("should throw a ValidationError", function() {
          let missingPath = Object.assign({}, invalidData);
          delete missingPath.request.path;

          mock = new Mock();
          try {
            mock.add(missingPath);
          } catch (err) {
            expect(err.name).to.eq("ValidationError");
          }
        });
      });

      describe("due to invalid request.method", function() {
        it("should throw a ValidationError", function() {
          let missingMethod = Object.assign({}, invalidData);
          delete missingMethod.request.method;

          mock = new Mock();
          try {
            mock.add(missingMethod);
          } catch (err) {
            expect(err.name).to.eq("ValidationError");
          }
        });
      });

      describe("due to invalid request.statusCode", function() {
        it("should throw a ValidationError", function() {
          let missingStatusCode = Object.assign({}, invalidData);
          delete missingStatusCode.response.statusCode;

          mock = new Mock();
          try {
            mock.add(missingStatusCode);
          } catch (err) {
            expect(err.name).to.eq("ValidationError");
          }
        });
      });
    });

    describe("when provided with a duplicate key", function() {
      beforeEach(function() {
        mock = new Mock();
        mock.add(validMock);
      });

      it("should overwrite the previous mock", function() {
        try {
          const duplicateMock = Object.assign({}, validMock);
          duplicateMock.response.body = { foo: "bar" };
          duplicateMock.response.statusCode = 500;
          mock.add(duplicateMock);
        } catch (err) {
          expect(mock.currentMocks[expectedKey]).to.deep.eq(validMock);
        }
      });

      it("should throw an AlreadyExistsError", function() {
        try {
          const duplicateMock = Object.assign({}, validMock);
          duplicateMock.response.body = { foo: "bar" };
          duplicateMock.response.statusCode = 500;
          mock.add(duplicateMock);
        } catch (err) {
          expect(err.name).to.eq("AlreadyExistsError");
          expect(err.message).to.eq("Mock already exists");
        }
      });
    });

    describe("when provided with an array of mocks", function() {
      it("should add every element of the array to mocks", function() {
        const changes = {
          name: "foo",
          request: { path: "/foo", method: "GET" }
        };
        const secondValidMock = Object.assign({}, validMock, changes);

        const providedMocks = [];
        mock = new Mock(providedMocks);
        mock.add([validMock, secondValidMock]);

        const mockKeys = Object.keys(mock.currentMocks);

        expect(mockKeys).to.have.length(2);
      });
    });
  });

  describe("#all", function() {
    it("should provide an array of mocks", function() {
      mock = new Mock();
      mock.add(validMock);

      const returnedMocks = mock.all();

      expect(returnedMocks).to.be.an("array");
      expect(returnedMocks).to.have.length(1);
      expect(returnedMocks[0]).to.deep.eq(validMock);
    });
  });

  describe("#clear", function() {
    it("should remove all mocks", function() {
      const providedMocks = [validMock];
      mock = new Mock(providedMocks);
      mock.clear();

      const resultingMocks = mock.all();

      expect(Object.keys(resultingMocks)).to.have.length(0);
    });
  });

  describe("#find", function() {
    it("should return the correct mock", function() {
      mock = new Mock();
      mock.add(validMock);

      const found = mock.find({ path: "/hello", method: "GET" });
      expect(found).to.deep.eq(validMock);
    });
    it("should return the mock in the correct format", function() {
      mock = new Mock();
      mock.add(validMock);

      const found = mock.find({ path: "/hello", method: "GET" });
      expect(found).to.have.keys(["name", "request", "response"]);
    });
  });
});
