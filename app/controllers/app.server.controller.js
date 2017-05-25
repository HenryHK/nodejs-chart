"use strict";

var Revision = require("../models/revision");

module.exports.showIndex = function(req, res) {
    var mostRevisedArticle;
    var leastRevisedArticle;
    var articleWithLargestGroupOfUsers;
    var articleWithSmallestGroupOfUsers
    var longestHistoryArticle;
    var shortestHistoryArticle;
    var article;

    var pieChartData;
    var barChartData;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(7, function() {
        console.log("latch.signal() was called 7 times.");
        res.render("index.pug", {
            mostRevisedArticle: mostRevisedArticle,
            leastRevisedArticle: leastRevisedArticle,
            articleWithLargestGroupOfUsers: articleWithLargestGroupOfUsers,
            articleWithSmallestGroupOfUsers: articleWithSmallestGroupOfUsers,
            longestHistoryArticle: longestHistoryArticle,
            shortestHistoryArticle: shortestHistoryArticle,
            article: article
        });

    });

    /*get all titles*/
    Revision.getAllArticles(function(err, result) {
        if (err) {
            console.log("Get all titles failure!")
        } else {
            console.log(result);
            article = result;
            latch.signal();
        }
    });

    /*Overall data*/
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

module.exports.sendUserData = function(req, res) {
    var title = req.query.title;
    var users = req.query.users;

    var userInfo = [];

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(users.length, function() {
        console.log("latch.signal() was called 5 times.");
        console.log(userInfo);
        res.json({
            title: title,
            userInfo: userInfo
        });
    });

    for (var user of users) {
        Revision.getDataForOneUser(title, user, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                userInfo.push(result);
                latch.signal();
            }
        })
    }



}

module.exports.sendShowOneData = function(req, res) {
    console.log(req.query);
    var title = req.query.title;

    var distributionByUserAndYear;
    var distributionByUser;
    var distributionOfTop5;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(2, function() {
        console.log("latch.signal() was called 2 times.");
        res.json({
            distributionByUserAndYear: distributionByUserAndYear,
            distributionByUser: distributionByUser,
            distributionOfTop5: distributionOfTop5
        });
    });

    Revision.getDataByYearAndUser(title, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            distributionByUserAndYear = result;
            latch.signal();
        }
    });

    Revision.getDataByUser(title, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            distributionByUser = result;
            latch.signal();
        }
    });
}


module.exports.getLatest = function(req, res) {
    var title = req.query.title;

    var numOfRevisions;
    var top5Users;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(2, function() {
        console.log("latch.signal() was called 2 times.");
        res.json({
            title: title,
            numOfRevisions: numOfRevisions,
            top5Users: top5Users
        });
    });

    Revision.getNumberOfRevisions(title, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            numOfRevisions = result;
            latch.signal();
        }
    });
    Revision.findTop5RegularUsers(title, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            top5Users = result;
            latch.signal();
        }
    });
}

module.exports.sendOverallData = function(req, res) {

    var pieChartData;
    var barChartData;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(2, function() {
        console.log("latch.signal() was called 2 times.");

        res.json({
            pieChartData: JSON.stringify(pieChartData),
            barChartData: JSON.stringify(barChartData)
        });
    });

    Revision.getDistributionByUser(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            pieChartData = result;
            latch.signal();
        }
    });

    Revision.getDistributionByUserAndYear(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            barChartData = result;
            latch.signal();
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

    var pieChartData;
    var barChartData;

    function CDL(countdown, completion) {
        this.signal = function() {
            if (--countdown < 1) completion();
        };
    }
    var latch = new CDL(6, function() {
        console.log("latch.signal() was called 6 times.");
        res.render("overall.pug", {
            mostRevisedArticle: mostRevisedArticle,
            leastRevisedArticle: leastRevisedArticle,
            articleWithLargestGroupOfUsers: articleWithLargestGroupOfUsers,
            articleWithSmallestGroupOfUsers: articleWithSmallestGroupOfUsers,
            longestHistoryArticle: longestHistoryArticle,
            shortestHistoryArticle: shortestHistoryArticle,

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