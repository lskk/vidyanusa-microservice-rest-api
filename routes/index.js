var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/vidyanusa');

// Connected handler
mongoose.connection.on('connected', function (err) {
  console.log("Berhasil tersambung dengan Mongo DB");
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log("Gagal tersambung dengan Mongo DB, karena: "+err);
});

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schoolsSchema = new Schema({
  name : String
});

var schools = mongoose.model('school',schoolsSchema);

/* GET home page. */
router.get('/daftar_sekolah', function(req, res, next) {
  //
  schools.find()
    .then(function(doc){
        res.json({sekolah: doc});
        //res.json({sekolah: res});
        console.log('datanya:'+doc)
    });
});



module.exports = router;
