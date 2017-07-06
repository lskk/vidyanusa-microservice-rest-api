var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = Schema({
  email: {type: String, min: 1, max: 100, required: true},
  username: {type: String, min: 1, max: 100, required: true},
  nama_lengkap: {type: String, min: 1, max: 100, required: true},
  jenis_kelamin: {type: String, min: 1, max: 100, required: true},
  sandi: {type: String, min: 1, max: 100, required: true},
  sekolah: {type: String, min: 1, max: 100, required: true}

},{collection: 'pengguna'});

//Export model
module.exports = mongoose.model('pengguna', UserSchema);
