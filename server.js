"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var router = require("./app/routes/app.server.routes");

var app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, "app", "views"));
app.use("/", router);
app.use("/showOne", router);
app.use("/revision", router);

app.listen(3000, function() {
    console.log("The app is running");
});