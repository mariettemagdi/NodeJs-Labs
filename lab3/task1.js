const express = require("express");
const app = express();

//custom middleware -> will be call with each request
app.use(function (req, res, next) {
  console.log("this is a custom middlware");
  next();
});

app.get("/", (req, res) => {
  res.send("welcome to home");
});
app.get("/about", (req, res) => {
  res.send("welcome to about");
});
app.get("/contact", (req, res) => {
  res.send("welcome to about");
});

app.listen(8080);
