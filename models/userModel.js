var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = Schema({
  email: {type: String, min: 1, max: 100, required: true},
  sandi: {type: String, min: 1, max: 100, required: true},
  peran: {type: Number, required: true},
  sekolah: {type: Schema.ObjectId, ref: 'sekolah'},
  profil:{
    username: {type: String, min: 1, max: 100, required: true},
    nama_lengkap: {type: String, min: 1, max: 100, required: true},
    jenis_kelamin: {type: String, min: 1, max: 100, required: true}
  },
  mobile_session: {type: String, min: 0, max: 1000},
  remember_token: {type: String, min: 0, max: 1000}
},{collection: 'pengguna'});

//Export model
module.exports = mongoose.model('pengguna', UserSchema);
