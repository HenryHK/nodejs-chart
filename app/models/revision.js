var mongoose = require('./db');

var RevisionSchema = new mongoose.Schema({
    title: String,
    timestamp: Date,
    user: String,
    anon: String,
    type: String
}, {
    versionKey: false
});

/**
 * All functions needed by overall page
 */
RevisionSchema.statics.findMostRevisedArticle = function(callback) {
    var mostRevisedArticlePipeline = [
        { '$group': { '_id': "$title", 'numOfRevisions': { $sum: 1 } } },
        { '$sort': { numOfRevisions: -1 } },
        { '$limit': 1 }
    ]

    this.aggregate(mostRevisedArticlePipeline).exec(callback);
}

RevisionSchema.statics.findLeastRevisedArticle = function(callback) {
    var mostRevisedArticlePipeline = [
        { '$group': { '_id': "$title", 'numOfRevisions': { $sum: 1 } } },
        { '$sort': { numOfRevisions: 1 } },
        { '$limit': 1 }
    ]

    this.aggregate(mostRevisedArticlePipeline).exec(callback);
}

RevisionSchema.statics.findArticleWithLargestGroupOfUsers = function(callback) {
    var articleWithLargestGroupOfUsersPipeLine = [
        { '$match': { 'anon': { '$exists': false } } },
        { '$group': { '_id': { title: '$title', user: '$user' } } },
        { '$group': { '_id': { title: '$_id.title' }, 'count': { $sum: 1 } } },
        { '$sort': { 'count': -1 } },
        { '$limit': 1 }
    ];

    this.aggregate(articleWithLargestGroupOfUsersPipeLine).exec(callback);
}

RevisionSchema.statics.findArticleWithSmallestGroupOfUsers = function(callback) {
    var articleWithLargestGroupOfUsersPipeLine = [
        { '$match': { 'anon': { '$exists': false } } },
        { '$group': { '_id': { title: '$title', user: '$user' } } },
        { '$group': { '_id': { title: '$_id.title' }, 'count': { $sum: 1 } } },
        { '$sort': { 'count': 1 } },
        { '$limit': 1 }
    ];

    this.aggregate(articleWithLargestGroupOfUsersPipeLine).exec(callback);
}

RevisionSchema.statics.findLongestHistoryArticle = function(callback) {

    var findLongestHistoryArticlePipeline = [{
            '$group': {
                '_id': { title: '$title' },
                maxTime: { $max: '$timestamp' },
                minTime: { $min: '$timestamp' }
            }
        },
        {
            '$project': {
                '_id': 0,
                'title': '$_id.title',
                'age': { $subtract: ['$maxTime', '$minTime'] }
            }
        },
        {
            '$sort': { 'age': -1 }
        },
        { '$limit': 1 }
    ];

    this.aggregate(findLongestHistoryArticlePipeline).exec(callback);
}

RevisionSchema.statics.findShortestHistoryArticle = function(callback) {

    var findLeastHistoryArticlePipeline = [{
            '$group': {
                '_id': { title: '$title' },
                maxTime: { $max: '$timestamp' },
                minTime: { $min: '$timestamp' }
            }
        },
        {
            '$project': {
                '_id': 0,
                'title': '$_id.title',
                'age': { $subtract: ['$maxTime', '$minTime'] }
            }
        },
        {
            '$sort': { 'age': 1 }
        },
        { '$limit': 1 }
    ];

    return this.aggregate(findLeastHistoryArticlePipeline).exec(callback);
}

RevisionSchema.statics.getDistributionByUser = function(callback) {
    var distributionByUserPipeline = [{
            '$group': {
                '_id': { type: '$type' },
                'count': { $sum: 1 }
            }
        },
        {
            '$project': { 'type': '$_id.type', 'count': 1, '_id': 0 }
        }

    ];

    return this.aggregate(distributionByUserPipeline).exec(callback);
}

RevisionSchema.statics.getDistributionByUserAndYear = function(callback) {
    var distributionByUserAndYearPipeline = [{
            '$group': {
                '_id': { year: { $year: '$timestamp' }, type: '$type' },
                'count': { $sum: 1 }
            }
        },
        {
            '$project': { 'year': '$_id.year', 'type': '$_id.type', 'count': 1, '_id': 0 }
        },
        {
            '$sort': { year: 1 }
        }

    ];

    return this.aggregate(distributionByUserAndYearPipeline).exec(callback);
}

/**
 * All functions needed by showOne page
 */

RevisionSchema.statics.getAllArticles = function(callback) {
    var getAllArticlesPipeline = [{
            '$group': {
                '_id': { title: '$title' }
            }
        },
        {
            '$project': { 'title': '$_id.title', '_id': 0 }
        },
        {
            '$sort': { 'title': 1 }
        }

    ]

    return this.aggregate(getAllArticlesPipeline).exec(callback);
}

RevisionSchema.statics.getNumberOfRevisions = function(title, callback) {
    return this.find({ 'title': title })
        .count()
        .exec(callback);
}

RevisionSchema.statics.findTop5RegularUsers = function(title, callback) {

    var top5RegularUsersPipeline = [

        {
            '$match': { title: title, type: 'regular' }
        },
        {
            '$group': {
                '_id': { user: '$user' },
                'count': { $sum: 1 }
            }
        },
        {
            '$project': { 'user': '$_id.user', 'count': 1, '_id': 0 }
        },
        {
            '$sort': { 'count': -1 }
        },
        {
            '$limit': 5
        }

    ]

    return this.aggregate(top5RegularUsersPipeline).exec(callback);
}

RevisionSchema.statics.getDataByUser = function(title, callback) {
    var dataByUserPipeLine = [{
            '$match': { 'title': title }
        },
        {
            '$group': {
                '_id': { type: '$type' },
                'count': { $sum: 1 }
            }
        },
        {
            '$project': { 'type': '$_id.type', 'count': 1, '_id': 0 }
        }

    ];

    return this.aggregate(dataByUserPipeLine).exec(callback);
}

RevisionSchema.statics.getDataByYearAndUser = function(title, callback) {
    var dataByYearAndUserPipeline = [{
            '$match': {
                'title': title
            }
        },
        {
            '$group': {
                '_id': { year: { $year: '$timestamp' }, type: '$type' },
                'count': { $sum: 1 }
            }
        },
        {
            '$project': { 'year': '$_id.year', 'type': '$_id.type', 'count': 1, '_id': 0 }
        },
        {
            '$sort': { year: 1 }
        }

    ];

    return this.aggregate(dataByYearAndUserPipeline).exec(callback)
}

RevisionSchema.statics.getDataForOneUser = function(title, user, callback) {

}

//*****************************************************************/
RevisionSchema.statics.findTitleLatestRev = function(title, callback) {

        return this.find({ 'title': title })
            .sort({ 'timestamp': -1 })
            .limit(1)
            .exec(callback)
    }
    /*
    RevisionSchema.statics.findAllArticles = function(callback) {

        var findAllArticlesPipeline = [{
                '$group': {
                    '_id': { title: '$title' }
                }
            },
            {
                '$project': { 'title': '$_id.title', '_id': 0 }
            },
            {
                '$sort': { 'title': 1 }
            }

        ]

        this.aggregate(findAllArticlesPipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findTitleLatestRev = function(title, callback) {

        return this.find({ 'title': title })
            .sort({ 'timestamp': -1 })
            .limit(1)
            .exec(callback)
    }

    RevisionSchema.statics.findMostRevisedArticle = function(callback) {

        var mostRevisedArticlePipeline = [
            { '$group': { '_id': "$title", 'numOfRevisions': { $sum: 1 } } },
            { '$sort': { numOfRevisions: -1 } },
            { '$limit': 1 }
        ]

        this.aggregate(mostRevisedArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findLeastRevisedArticle = function(callback) {

        var leastRevisedArticlePipeline = [
            { '$group': { '_id': '$title', 'numOfRevisions': { $sum: 1 } } },
            { '$sort': { numOfRevisions: 1 } },
            { '$limit': 1 }
        ]

        this.aggregate(leastRevisedArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findMostPopularArticle = function(callback) {

        var findMostPopularArticlePipeline = [
            { '$match': { type: 'user' } },
            { '$group': { '_id': { title: '$title', user: '$user' } } },
            { '$group': { '_id': { title: '$_id.title' }, 'count': { $sum: 1 } } },
            { '$sort': { 'count': -1 } },
            { '$limit': 1 }
        ]

        this.aggregate(findMostPopularArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findLeastPopularArticle = function(callback) {

        var findLeastPopularArticlePipeline = [
            { '$match': { type: 'user' } },
            { '$group': { '_id': { title: '$title', user: '$user' } } },
            { '$group': { '_id': { title: '$_id.title' }, 'count': { $sum: 1 } } },
            { '$sort': { 'count': 1 } },
            { '$limit': 1 }
        ]

        this.aggregate(findLeastPopularArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findLongestHistoryArticle = function(callback) {

        var findLongestHistoryArticlePipeline = [{
                '$group': {
                    '_id': { title: '$title' },
                    maxTime: { $max: '$timestamp' },
                    minTime: { $min: '$timestamp' }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'title': '$_id.title',
                    'age': { $subtract: ['$maxTime', '$minTime'] }
                }
            },
            {
                '$sort': { 'age': -1 }
            },
            { '$limit': 1 }
        ]

        this.aggregate(findLongestHistoryArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findLeastHistoryArticle = function(callback) {

        var findLeastHistoryArticlePipeline = [{
                '$group': {
                    '_id': { title: '$title' },
                    maxTime: { $max: '$timestamp' },
                    minTime: { $min: '$timestamp' }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'title': '$_id.title',
                    'age': { $subtract: ['$maxTime', '$minTime'] }
                }
            },
            {
                '$sort': { 'age': 1 }
            },
            { '$limit': 1 }
        ]

        this.aggregate(findLeastHistoryArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.statRevByYearByType = function(callback) {

        var statRevByYearByTypePipeline = [{
                '$group': {
                    '_id': { year: { $year: '$timestamp' }, type: '$type' },
                    'count': { $sum: 1 }
                }
            },
            {
                '$project': { 'year': '$_id.year', 'type': '$_id.type', 'count': 1, '_id': 0 }
            },
            {
                '$sort': { year: 1 }
            }

        ]

        this.aggregate(statRevByYearByTypePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.statRevByType = function(callback) {

        var statRevByTypePipeline = [{
                '$group': {
                    '_id': { type: '$type' },
                    'count': { $sum: 1 }
                }
            },
            {
                '$project': { 'type': '$_id.type', 'count': 1, '_id': 0 }
            }

        ]

        this.aggregate(statRevByTypePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.statTotalRevisionOfArticle = function(article, callback) {

        this.count({ title: article }, function(err, results) {
            if (err) {
                console.log("Count Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findTop5RegUsersRevisedArticle = function(article, callback) {

        var findTop5RegUsersRevisedArticlePipeline = [

            {
                '$match': { title: article, type: 'user' }
            },
            {
                '$group': {
                    '_id': { user: '$user' },
                    'count': { $sum: 1 }
                }
            },
            {
                '$project': { 'user': '$_id.user', 'count': 1, '_id': 0 }
            },
            {
                '$sort': { 'count': -1 }
            },
            {
                '$limit': 5
            }

        ]

        this.aggregate(findTop5RegUsersRevisedArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.statRevByYearByTypeOfArticle = function(article, callback) {

        var statRevByYearByTypeOfArticlePipeline = [{
                '$match': { title: article }
            },
            {
                '$group': {
                    '_id': { year: { $year: '$timestamp' }, type: '$type' },
                    'count': { $sum: 1 }
                }
            },
            {
                '$project': { 'year': '$_id.year', 'type': '$_id.type', 'count': 1, '_id': 0 }
            },
            {
                '$sort': { year: 1 }
            }

        ]

        this.aggregate(statRevByYearByTypeOfArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.statRevByTypeOfArticle = function(article, callback) {

        var statRevByTypeOfArticlePipeline = [{
                '$match': { title: article }
            },
            {
                '$group': {
                    '_id': { type: '$type' },
                    'count': { $sum: 1 }
                }
            },
            {
                '$project': { 'type': '$_id.type', 'count': 1, '_id': 0 }
            }

        ]

        this.aggregate(statRevByTypeOfArticlePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.statRevByYearByUserOfArticle = function(user, article, callback) {

        var statRevByYearByTypePipeline = [{
                '$match': { 'user': user, 'title': article }
            },
            {
                '$group': {
                    '_id': { year: { $year: '$timestamp' } },
                    'count': { $sum: 1 }
                }
            },
            {
                '$project': { 'year': '$_id.year', 'count': 1, '_id': 0 }
            },
            {
                '$sort': { year: 1 }
            }

        ]

        this.aggregate(statRevByYearByTypePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }

    RevisionSchema.statics.findUsersOfArticle = function(article, callback) {

        var statRevByYearByTypePipeline = [{
                '$match': { 'title': article, 'type': 'user' }
            },
            {
                '$group': {
                    '_id': { user: '$user' }
                }
            },
            {
                '$project': { 'user': '$_id.user', '_id': 0 }
            },
            {
                '$sort': { user: 1 }
            }

        ]

        this.aggregate(statRevByYearByTypePipeline, function(err, results) {
            if (err) {
                console.log("Aggregation Error")
            } else {
                callback(results)
            }
        });
    }
    */

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions');

module.exports = Revision;