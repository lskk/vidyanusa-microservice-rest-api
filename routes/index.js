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
  console.log(req.body.username);
  console.log(req.body.password);

  co(function*() {
    // Connection URL
    var url = 'mongodb://localhost:27017/vidyanusa';
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url);
    //console.log('Berhasil koneksi ke database');

    // Find the collection users
    var col = db.collection('users');
    var docs = yield col.find({username: req.body.username , password: req.body.password}).toArray();

    // Close the connection
    db.close();

    res.json({status: '00' , message: 'success', data: docs, proceed: 1});

  }).catch(function(err) {
    console.log(err.stack);

    // Close the connection
    db.close();

    res.json({status: '01' , message: 'failed'});
  });


});

module.exports = router;
