const http = require("http");
const fs = require("fs");

function returnHtmlFile(status, path, res) {
  const content = fs.readFileSync(path, "utf-8");
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(content);
}
const server = http.createServer(function (req, res) {
  if (req.url == "/") {
    returnHtmlFile(200, "home.html", res);
  } else if (req.url == "/contact") {
    returnHtmlFile(200, "contact.html", res);
  } else if (req.url == "/about") {
    returnHtmlFile(200, "about.html", res);
  } else if (req.url == "/about.css") {
    const content = fs.readFileSync("about.css", "utf-8");
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(content);
  } else {
    returnHtmlFile(404, "error.html", res);
  }
});

server.listen(8087);
