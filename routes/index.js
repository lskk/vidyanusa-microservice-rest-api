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

    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(alamatMongoDB);
    //console.log('Berhasil koneksi ke database');

    // Get the collection
    var col = db.collection('sekolah');
    var docs = yield col.find().toArray();

    // Close the connection
    db.close();

    res.json({status: '00' , message: 'success', data: docs});

  }).catch(function(err) {
    console.log(err.stack);

    // Close the connection
    db.close();

    res.json({status: '01' , message: 'failed'});
  });


});

router.post('/masuk', function(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  if(email == "" || password == ""){
    res.json({status: 'failed' , message: 'Mohon isi semua field yang dibutuhkan'});
  }else{

  co(function*() {
    // Connection URL

    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(alamatMongoDB);
    //console.log('Berhasil koneksi ke database');

    // Find the collection users
    var col = db.collection('pengguna');
    var docs = yield col.find({email: req.body.email , sandi: req.body.password}).toArray();

    // Close the connection
    db.close();

    if(docs == null || docs == ''){
      res.json({status: 'failed' , message: 'Username atau password anda salah' , results: docs});
    }else{
      res.json({status: 'success' , results: docs});
    }

  }).catch(function(err) {
    console.log(err.stack);

    // Close the connection
    db.close();

    res.json({status: 'failed' , message: 'Bermasalah pada server.'});
  });

}


});

module.exports = router;
