var mongoose = require('./db')

var RevisionSchema = new mongoose.Schema({
    title: String,
    timestamp: String,
    user: String,
    anon: String
}, {
    versionKey: false
})

RevisionSchema.statics.findTitleLatestRev = function(title, callback) {

    return this.find({ 'title': title })
        .sort({ 'timestamp': -1 })
        .limit(1)
        .exec(callback)
}

RevisionSchema.statics.getAllTitles = function(callback) {

    return this.find({}, { title: 1, _id: 0 }).exec(callback);
}

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

// Revision.aggregate([{ "$group": { "title": "$title" } }], function(err, result) {
//     if (err) {
//         console.log("Aggregation Error")
//     } else {
//         console.log("The titles: ")
//         console.log(results)
//     }
// });


module.exports = Revision