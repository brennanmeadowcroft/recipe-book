const request = require("axios");
const { Selector } = require("testcafe");

async function setMocks(mock) {
  return request
    .post("http://localhost:3000/mocks", { data: mock })
    .catch(err => {
      console.error(err.message);
    });
}

async function clearMocks() {
  return request.delete("http://localhost:3000/mocks").catch(err => {
    console.error(err.message);
  });
}

fixture`Recipe Book Demo`.page`http://localhost:8000/test`;

test("Verify successful GET request", async t => {
  const mock = {
    name: "Successful request",
    request: {
      path: "/hello",
      method: "GET"
    },
    response: {
      body: { hello: "Test!" },
      statusCode: 200
    }
  };

  await clearMocks();
  await setMocks(mock);

  const WAIT = 5000; // This is to make it easier to see what the UI does.

  await t
    .click("#getRequest")
    .wait(WAIT)
    .expect(Selector("#heading").innerText)
    .eql(mock.response.body.hello);
});

test("Verify unsuccessful GET request", async t => {
  const mock = {
    name: "Unsuccessful request",
    request: {
      path: "/hello",
      method: "GET"
    },
    response: {
      body: { message: "That didn't work!" },
      statusCode: 400
    }
  };

  await clearMocks();
  await setMocks(mock);

  const WAIT = 5000; // This is to make it easier to see what the UI does.

  await t
    .click("#getRequest")
    .wait(WAIT)
    .expect(Selector("#heading").innerText)
    .eql("")
    .expect(Selector("#errorMessage").innerText)
    .eql(mock.response.body.message)
    .expect(Selector("#statusCode").innerText)
    .eql(`${mock.response.statusCode}`);
});
