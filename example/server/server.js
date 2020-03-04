const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 8000;

const app = express();
const router = express.Router();

router.get("/test", function(req, res) {
  const file = path.join(`${__dirname}/index.html`);
  console.log("sending file", file);
  res.render("index", { mockUrl: process.env.MOCK_SERVICE_DOMAIN });
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use("/", router);

app.listen(PORT);
console.log(`test server listening on port ${PORT}`);
