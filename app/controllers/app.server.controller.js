"use strict";

var Revision = require("../models/revision");

module.exports.getLatest = function(req, res) {
    var title = req.query.title;

    Revision.findTitleLatestRev(title, function(err, result) {

        if (err) {
            console.log("Cannot find " + title + ",s latest revision!")
        } else {
            console.log(result)
            var revision = result[0]
            res.render('../views/revision.pug', { title: title, revision: revision })
        }
    });
}

module.exports.showOverall = function(req, res) {
    res.render("overall.ejs");
}

module.exports.showOne = function(req, res) {
    Revision.aggregate();
    Revision.getAllTitles(function(err, result) {
        if (err) {
            console.log("Get all titles failure!")
        } else {
            console.log(result);
            var revision = result;
            res.render("titleForm.pug", { revision: revision });
        }
    });
    // res.render("titleForm.pug");
}