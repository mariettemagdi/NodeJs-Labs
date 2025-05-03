const express = require("express");
const fs = require("fs");
const app = express();

const path = __dirname + "/log.txt";

function createLogFile(path, req) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(
      path,
      `request: ${new Date().toISOString()} - ${req.url} and ${req.method}`
    );
  } else {
    fs.appendFileSync(
      path,
      "\r\n" +
        `request: ${new Date().toISOString()} - ${req.url} and ${req.method}`
    );
  }
  console.log("file cretaed ");
}

app.get("/home", (req, res) => {
  createLogFile(path, req);
  res.send("logs added");
});

app.get("/logs", (req, res) => {
  const data = fs.readFileSync("log.txt", "utf-8");
  res.send(data);
});

app.listen(8080);
