var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MapelSchema = Schema({
  nama_mapel: {type: String, min: 1, max: 100, required: true},
  materi: [{type: Schema.ObjectId, ref: 'materi'}]
},{collection: 'mapel'});

var MateriSchema = Schema({
  nama_materi: {type: String, min: 1, max: 100, required: true}
},{collection: 'materi'});

//Export model
var Mapel  = mongoose.model('mapel', MapelSchema);
var Materi = mongoose.model('materi', MateriSchema);

module.exports = mongoose.model('mapel', MapelSchema);
