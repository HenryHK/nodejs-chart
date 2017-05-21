"use strict";

var Revision = require("../models/revision");


module.exports.getLatest = function(req, res) {
    var title = req.query.title;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(2, function() {
        console.log("latch.signal() was called 2 times.");
    });

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
    var mostRevisedArticle;
    var leastRevisedArticle;
    var articleWithLargestGroupOfUsers;
    var articleWithSmallestGroupOfUsers
    var longestHistoryArticle;
    var shortestHistoryArticle;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(6, function() {
        console.log("latch.signal() was called 7 times.");
        res.render("overall.pug", {
            mostRevisedArticle: mostRevisedArticle,
            leastRevisedArticle: leastRevisedArticle,
            articleWithLargestGroupOfUsers: articleWithLargestGroupOfUsers,
            articleWithSmallestGroupOfUsers: articleWithSmallestGroupOfUsers,
            longestHistoryArticle: longestHistoryArticle,
            shortestHistoryArticle: shortestHistoryArticle
        });
    });


    Revision.findMostRevisedArticle(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            mostRevisedArticle = result[0]._id;
            latch.signal();
        }
    });

    Revision.findLeastRevisedArticle(function(err, result) {
        if (err) {
            console.log(err);
        } else {

            leastRevisedArticle = result[0]._id;
            latch.signal();
        }
    });

    Revision.findArticleWithLargestGroupOfUsers(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);

            articleWithLargestGroupOfUsers = result[0]._id.title;
            latch.signal();
        }
    });

    Revision.findArticleWithSmallestGroupOfUsers(function(err, result) {
        if (err) {
            console.log(err);
        } else {

            articleWithSmallestGroupOfUsers = result[0]._id.title;
            latch.signal();
        }
    });

    Revision.findLongestHistoryArticle(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);

            longestHistoryArticle = result[0].title;
            latch.signal();
        }
    });

    Revision.findShortestHistoryArticle(function(err, result) {
        if (err) {
            console.log(err);
        } else {

            shortestHistoryArticle = result[0].title;
            latch.signal();
        }
    });



}

module.exports.showOne = function(req, res) {
    //Revision.aggregate();
    Revision.getAllArticles(function(err, result) {
        if (err) {
            console.log("Get all titles failure!")
        } else {
            console.log(result);
            var article = result;
            res.render("titleForm.pug", { article: article });
        }
    });
}