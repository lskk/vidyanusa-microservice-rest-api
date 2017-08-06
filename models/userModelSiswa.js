//Model untuk pengguna sebagai siswa
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = Schema({
  email: {type: String, min: 1, max: 100, required: true},
  sandi: {type: String, min: 1, max: 100, required: true},
  peran: {type: Number, required: true},
  kelas: {type: Schema.ObjectId, ref: 'kelas'},
  profil:{
    username: {type: String, min: 1, max: 100, required: true},
    nama_lengkap: {type: String, min: 1, max: 100, required: true},
    jenis_kelamin: {type: String, min: 1, max: 100, required: true},
    foto: {type: String, min: 1, max: 100, default: 'http://filehosting.pptik.id/TESISS2ITB/Vidyanusa/default-profile-picture.png'},
    bio: {type: String, min: 1, max: 100, default: '-'}
  },
  kelas: [{type: Schema.ObjectId, ref: 'kelas'}],
  prestasi: [],
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'pengguna'});

//Export model
module.exports = mongoose.model('penggunaSiswa', UserSchema);
