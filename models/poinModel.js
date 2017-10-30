//Model untuk pengguna sebagai guru
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PoinSchema = Schema({
  id_pengguna: {type: Schema.ObjectId, ref: 'pengguna', required: true},
  jumlah_poin: {type: Number, min: 1, max: 100, required: true},
  keterangan: {type: String, min: 1, max: 100, required: true},
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'poin'});

//Export model
module.exports = mongoose.model('poin', PoinSchema);
