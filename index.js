const express = require("express");
const app = express();
const { join } = require("path");
let { read } = require("./utils/libraries");

let libraries;
read(join(__dirname, "/libraries")).then((r) => (libraries = r));

app.get("/api/", (req, res) => {
  res.send({ message: "=)" });
});

app.all("*", (req, res) => {
  res.status(200).send(libraries);
});

module.exports = app;
