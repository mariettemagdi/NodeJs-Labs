const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");

//websocket
const webSocket = require("./websocket");
const server = http.createServer(app);

const key = "node@iti";
const users = [];
const posts = [];

//initialize web socket
webSocket(server, key);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.path == "/register" && req.method == "GET") {
    res.redirect("/register.html");
  } else if (req.path == "/login" && req.method == "GET") {
    res.redirect("login.html");
  } else {
    next();
  }
});

app.set("view engine", "ejs");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }
  jwt.verify(token, key, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token " });
    }
    req.user = user;
    next();
  });
}
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({ msg: "registration successful" });
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  const user = users.find((u) => u.username === username);
  if (user && user.password === password) {
    const token = jwt.sign({ username }, key);
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json({ msg: "login" });
  } else {
    res.status(401).send({ msg: "incorrect username or password " });
  }
});

app.get("/posts", authenticateToken, (req, res) => {
  console.log("Rendering posts with:", {
    user: req.user,
    posts: posts,
  });
  res.render("posts", { posts: posts, user: req.user });
});

app.post("/posts", authenticateToken, (req, res) => {
  const { content } = req.body;
  const newPost = {
    id: posts.length + 1,
    username: req.user.username,
    content: req.body.content,
    createdAt: new Date(),
  };
  posts.unshift(newPost);
  res.redirect("/posts");
});
server.listen(8080);
