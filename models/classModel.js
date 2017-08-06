var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = Schema({
  nama_kelas: {type: String, min: 1, max: 100, required: true},
  sekolah: {type: Schema.ObjectId, ref: 'sekolah', required: true},
  kode: {type: String, min: 1, max: 100, required: true},
  mapel: [{type: Schema.ObjectId, ref: 'mapel'}],  
  pengajar: [
          {
            guru:{type: Schema.ObjectId, ref: 'pengguna'},
            mapel:{type: Schema.ObjectId, ref: 'mapel'}
          }
        ],
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'kelas'});

//Export model
module.exports = mongoose.model('kelas', ClassSchema);
