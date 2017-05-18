"use strict";

var express = require("express");
var controller = require("../controllers/app.server.controller");
var router = express.Router()

router.get('/revision', controller.getLatest);
router.get('/', controller.showOverall);
router.post('/showOne', controller.showOne);


module.exports = router