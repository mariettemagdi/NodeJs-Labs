const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let cars = [];

//show all cars
app.get("/cars", function (req, res) {
  res.send(cars);
});

//add car
app.post("/addcar", function (req, res) {
  cars.push(req.body);
  res.send({ msg: "car added successfully" });
});

//delete car
app.get("/deletecar", function (req, res) {
  const id = req.query.id;
  const index = cars.findIndex((x) => x.id == id);
  if (index > -1) {
    cars.splice(index, 1);
    res.send({ msg: "car deleted" });
  } else {
    res.send({ msg: "no car found with this id" + id });
  }
});

//edit car
app.post("/editcar", function (req, res) {
  const id = req.query.id;
  const index = cars.findIndex((x) => x.id == id);
  if (index > -1) {
    cars[index] = { ...cars[index], ...req.body };
    res.send({ msg: "car updated" });
  } else {
    res.send({ msg: "no car found with this id" + id });
  }
});

//show specific car
app.get("/showcar", function (req, res) {
  const id = req.query.id;
  const index = cars.findIndex((x) => x.id == id);
  res.send(cars[index]);
});

//fetch html file
app.get("/carsmanager", function (req, res) {
  res.sendFile(__dirname + "/carsmanager.html");
});

app.listen(8080);
