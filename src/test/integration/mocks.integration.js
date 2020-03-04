const request = require("supertest");
const { expect } = require("chai");
const cloneDeep = require("lodash.clonedeep");
const { validMock } = require("../helpers/fixtures");
const app = require("../../app");

describe("/mocks", function() {
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
});
