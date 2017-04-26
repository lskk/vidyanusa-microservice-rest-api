var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');

//Pengaturan koneksi ke database
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');


/* GET list of schools. */
router.get('/daftar_sekolah', function(req, res, next) {
  co(function*() {
    // Connection URL
    var url = 'mongodb://localhost:27017/vidyanusa';
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url);
    //console.log('Berhasil koneksi ke database');

    // Get the collection
    var col = db.collection('schools');
    var docs = yield col.find().toArray();

    res.json({status: '00' , message: 'success', data: docs});
    // Close the connection
    db.close();
  }).catch(function(err) {
    console.log(err.stack);
  });


});



module.exports = router;
