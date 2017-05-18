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

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision