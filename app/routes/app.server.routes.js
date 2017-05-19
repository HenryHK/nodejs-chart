"use strict";

var express = require("express");
var controller = require("../controllers/app.server.controller");
var router = express.Router()

router.get('/showOne', controller.showOne);
router.get('/revision', controller.getLatest);
router.get('/', controller.showOverall);

module.exports = router