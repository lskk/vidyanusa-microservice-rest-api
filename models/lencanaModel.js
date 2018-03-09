//Model untuk lencana
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LencanaSchema = Schema({
  nama: {type: String},
  keterangan: {type: String},
  lokasi_gambar_lencana: {type: String}
},{collection: 'lencana'});

//Export model
module.exports = mongoose.model('lencana', LencanaSchema);
