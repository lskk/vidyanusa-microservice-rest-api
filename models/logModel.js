//Model untuk pengguna sebagai guru
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LogSchema = Schema({
  pengguna: {type: Schema.ObjectId, ref: 'pengguna', required: true},
  tipe: {type: Number, min: 1, max: 100, required: true},  //isi dengan angka 1.LMS 2.Forum 3.Game 4.Portal 5.Blog
  judul: String,
  link: String,
  created_at: { type: Date, default: Date.now}
},{collection: 'log'});

//Export model
module.exports = mongoose.model('log', LogSchema);
