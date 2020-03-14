const request = require("supertest");
const { expect } = require("chai");
const cloneDeep = require("lodash.clonedeep");
const { validMock } = require("../helpers/fixtures");
const app = require("../../app");

describe("Requesting a mock", function() {
  const submitMock = async mock => {
    await request(app)
      .post("/mocks")
      .send({ data: mock });
  };

  afterEach(async function() {
    await request(app).delete("/mocks");
  });

  describe("with a GET request", function() {
    it("should return the correct mock", async function() {
      const getMock = cloneDeep(validMock);
      await submitMock(getMock);

      await request(app)
        .get(getMock.request.path)
        .expect(getMock.response.statusCode)
        .then(response => {
          expect(response.body).to.deep.eq(getMock.response.body);
        });
    });
  });
  describe("with a POST request", function() {
    it("should return the correct mock", async function() {
      const postMock = cloneDeep(validMock);
      postMock.request.method = "POST";
      postMock.response.statusCode = 201;
      postMock.response.body = {};

      await submitMock(postMock);

      await request(app)
        .post(postMock.request.path)
        .expect(postMock.response.statusCode)
        .then(response => {
          expect(response.body).to.deep.eq(postMock.response.body);
        });
    });
  });
  describe("with a PUT request", function() {
    it("should return the correct mock", async function() {
      const putMock = cloneDeep(validMock);
      putMock.request.method = "PUT";

      await submitMock(putMock);

      await request(app)
        .put(putMock.request.path)
        .expect(putMock.response.statusCode)
        .then(response => {
          expect(response.body).to.deep.eq(putMock.response.body);
        });
    });
  });
  describe("with a DELETE request", function() {
    it("should return the correct mock", async function() {
      const deleteMock = cloneDeep(validMock);
      deleteMock.request.method = "DELETE";
      deleteMock.response.body = {};

      await submitMock(deleteMock);

      await request(app)
        .delete(deleteMock.request.path)
        .expect(deleteMock.response.statusCode)
        .then(response => {
          expect(response.body).to.deep.eq(deleteMock.response.body);
        });
    });
  });

  describe("When a mock DOES NOT match", function() {
    it("should return a 404", async function() {
      const getMock = cloneDeep(validMock);
      await submitMock(getMock);

      await request(app)
        .get("/obviously_fake")
        .expect(404)
        .then(response => {
          expect(response.body).to.have.keys(["error", "message"]);
          expect(response.body.error).to.eq("NotFoundError");
        });
    });
  });

  describe("When a mock contains a timeout", function() {
    it("should wait the provided interval before returning", async function() {
      const WAIT_INTERVAL_MS = 1000;

      const timeoutMock = cloneDeep(validMock);
      timeoutMock.response.timeout = WAIT_INTERVAL_MS;
      await submitMock(timeoutMock);

      const startTime = Date.now();
      await request(app).get(timeoutMock.request.path);

      const endTime = Date.now();
      const waitTime = endTime - startTime;
      const ALLOWED_VARIANCE_MS = 10; // This is to allow for time to run the code beyond the timeout
      expect(waitTime).to.be.within(
        WAIT_INTERVAL_MS,
        WAIT_INTERVAL_MS + ALLOWED_VARIANCE_MS
      );
    });
  });
});
