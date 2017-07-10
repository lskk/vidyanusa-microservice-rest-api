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
    jenis_kelamin: {type: String, min: 1, max: 100, required: true},
    foto: {type: String, min: 1, max: 100, default: 'http://pasp.org.pk/assets/img/pic.png'},
    bio: {type: String, min: 1, max: 100, default: '-'}
  },
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'pengguna'});

//Export model
module.exports = mongoose.model('pengguna', UserSchema);
