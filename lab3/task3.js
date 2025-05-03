const express = require("express");
const app = express();
const EventEmitter = require("events");
const event = new EventEmitter();

// define event listener
event.on("RequestReceived", function (req) {
  console.log(`Request Received ${req.method} ${req.url}`);
});

app.get("/", function (req, res) {
  event.emit("RequestReceived", req);
  res.send("event triggered");
});
app.listen(8080);
