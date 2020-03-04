const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const loggerMiddleware = require("./middleware/logger");
const mockRoutes = require("./mocks/routes");
const Mock = require("./models/Mock");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.use(loggerMiddleware);

const mock = Mock();
const routes = mockRoutes(mock);

app.use("/", routes);
app.use(errorHandler);

module.exports = app;
