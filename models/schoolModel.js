var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SchoolSchema = Schema({
  nama_sekolah: {type: String, min: 3, max: 100, required: true}
},{collection: 'sekolah'});

//Export model
module.exports = mongoose.model('sekolah', SchoolSchema);
