const app = require("./app");

const PORT = process.env.PORT || 12001;

app.listen(PORT, () => {
  console.log(`Application listening on ${PORT}`);
});
