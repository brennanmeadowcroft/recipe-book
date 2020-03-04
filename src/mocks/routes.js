const express = require("express");
const router = express.Router();
const MockController = require("./controllers");

function mockRoutes(mock) {
  const controller = MockController(mock);

  router.get("/mocks", controller.list);
  router.post("/mocks", controller.add);
  router.delete("/mocks", controller.clear);
  router.all("*", controller.find);

  return router;
}

module.exports = mockRoutes;
