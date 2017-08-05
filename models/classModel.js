var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = Schema({
  nama_kelas: {type: String, min: 1, max: 100, required: true},
  kode_kelas: {type: String, min: 1, max: 100, required: true},
  sekolah: {type: Schema.ObjectId, ref: 'sekolah'},
  mapel: [{type: Schema.ObjectId, ref: 'mapel'}],
  pengajar: [
          {
            guru:{type: Schema.ObjectId, ref: 'pengguna'},
            mapel:{type: Schema.ObjectId, ref: 'mapel'}
          }
        ],
  keterangan: {type: String, min: 1, max: 100, required: true}
},{collection: 'kelas'});

//Export model
module.exports = mongoose.model('kelas', ClassSchema);
