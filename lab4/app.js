const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const client = new MongoClient("mongodb://localhost:27017");
let sessions = {};

async function connectToDB() {
  await client.connect();
  const mydb = client.db("lab5");
  app.db = mydb;

  const users = mydb.collection("users").find().toArray();
  console.log(users);
  console.log("connected to mongoDB");

  app.listen(8080);
}

connectToDB();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//custom middleware auth
function auth(roles) {
  return function (req, res, next) {
    const sid = req.cookies.sid;
    if (sid && sessions[sid]) {
      const user = sessions[sid];
      if (roles.includes(user.role)) {
        req.user = user;
        return next();
      }
    }
    res.status(401).end("Unauthorized");
  };
}

app.post("/register", async function (req, res) {
  const { username, password, role } = req.body;
  const existingUser = await app.db.collection("users").findOne({ username });
  if (existingUser) {
    return res.status(400).send("username already exits");
  }
  //hashing password
  const encryptedPassword = await bcrypt.hash(password, 10);

  //insert in DB
  await app.db
    .collection("users")
    .insertOne({ username, password: encryptedPassword, role });
  res.send("register successful");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await app.db.collection("users").findOne({ username });

  if (!user) {
    res.status(404).send("Invalid username or password");
  }
  //   const match = await bcrypt.compare(password, user.password);
  const sid = uuidv4();
  sessions[sid] = user;
  console.log(sessions);
  res.cookie("sid", sid);
  res.send("login success");
});

app.get("/home", auth(["user", "admin"]), (req, res) => {
  res.send("welcome" + req.user.username);
});

app.get("/admindata", auth(["admin"]), (req, res) => {
  if (req.user.role == "admin") {
    res.send("welcome admin " + req.user.name);
  } else {
    res.status(401).send("unaithorized");
  }
});
