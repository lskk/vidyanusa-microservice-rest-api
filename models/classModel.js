var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = Schema({
  nama_kelas: {type: String, min: 1, max: 100, required: true},
  kode_kelas: {type: String, min: 1, max: 100, required: true},
  keterangan: {type: String, min: 1, max: 100, required: true}
},{collection: 'kelas'});

//Export model
module.exports = mongoose.model('kelas', ClassSchema);
