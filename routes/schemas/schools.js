var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SchoolsSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Bear', SchoolsSchema);
