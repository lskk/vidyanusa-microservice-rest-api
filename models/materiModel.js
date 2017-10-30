var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MateriSchema = Schema({
  nama_materi: {type: String, min: 1, max: 100, required: true}
},{collection: 'materi'});



//Export model
module.exports = mongoose.model('materi', MateriSchema);
