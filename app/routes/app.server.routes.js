"use strict";

var express = require("express");
var controller = require("../controllers/app.server.controller");
var router = express.Router()

router.get('/UserData', controller.sendUserData);
router.get('/OneData', controller.sendShowOneData);
router.get('/OverallData', controller.sendOverallData);
router.get('/showOne', controller.showOne);
router.get('/revision', controller.getLatest);
router.get('/', controller.showIndex);

module.exports = router