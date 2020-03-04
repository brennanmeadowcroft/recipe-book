const request = require("supertest");
const { expect } = require("chai");
const cloneDeep = require("lodash.clonedeep");
const { validMock } = require("../helpers/fixtures");
const app = require("../../app");

describe("POST /mocks", function() {
  describe("when provided with a valid mock", function() {
    it("should create a mock", function(done) {
      request(app)
        .post("/mocks")
        .send({ data: validMock })
        .expect(201)
        .then(response => {
          expect(response.text).to.eq("CREATED");

          done();
        });
    });
  });

  describe("when provided with an invalid mock", function() {
    it("should return an error", function(done) {
      const invalidMock = cloneDeep(validMock);
      delete invalidMock.request.path;

      request(app)
        .post("/mocks")
        .send({ data: invalidMock })
        .expect(400)
        .then(response => {
          expect(response.body).to.have.keys(["error", "message"]);
          expect(response.body.error).to.eq("ValidationError");

          done();
        });
    });
  });
});

describe("GET /mocks", async function() {
  beforeEach(async function() {
    await request(app)
      .post("/mocks")
      .send({ data: validMock });
  });

  it("should retrieve the correct mock", async function() {
    await request(app)
      .get(validMock.request.path)
      .expect(validMock.response.statusCode)
      .then(response => {
        expect(response.body).to.deep.eq(validMock.response.body);
      });
  });
});

describe("DELETE /mocks", function() {
  beforeEach(async function() {
    await request(app)
      .post("/mocks")
      .send({ data: validMock });
  });

  it("should clear out all mocks", async function() {
    await request(app)
      .delete("/mocks")
      .expect(200);

    await request(app)
      .get("/mocks")
      .then(response => {
        expect(response.body).to.deep.eq([]);
      });
  });
});

describe("Requesting a mock", function() {
  const submitMock = async mock => {
    await request(app)
      .post("/mocks")
      .send({ data: mock });
  };

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
    it.only("should return a 404", async function() {
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
});
