const validMock = {
  name: "Valid Mock",
  request: {
    path: "/hello",
    method: "GET"
  },
  response: {
    body: { hello: "world" },
    statusCode: 200
  }
};

module.exports = {
  validMock
};
