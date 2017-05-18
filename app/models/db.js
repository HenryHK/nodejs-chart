var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/wikipedia', function () {
  console.log('mongodb connected')
})

module.exports = mongoose