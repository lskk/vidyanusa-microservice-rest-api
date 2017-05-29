var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

//Pengaturan koneksi ke database
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

//Untuk keperluan mengambil object id
var mongo = require('mongodb');

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



router.get('/daftar_kegiatan', function(req, res, next) {

  co(function*() {
    // Connection URL

    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(alamatMongoDB);
    //console.log('Berhasil koneksi ke database');

    // Get the collection
    var col = db.collection('kegiatan');
    var docs = yield col.find().sort({"created_at": -1}).limit(5).toArray();

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

router.get('/profil/:userId', function(req, res) {
    var userId = req.params.userId

    co(function*() {
      // Connection URL

      // Use connect method to connect to the Server
      var db = yield MongoClient.connect(alamatMongoDB);
      //console.log('Berhasil koneksi ke database');

      // Get the collection
      //var docs = yield col.find({email: req.body.email , sandi: req.body.password}).toArray();
      var o_id = new mongo.ObjectID(userId);
      var col = db.collection('pengguna');
      var docs = yield col.find({_id: o_id}).toArray();

      // Close the connection
      db.close();

      if(docs == null || docs == ''){
        res.json({status: 'failed' , message: 'Tidak dapat mengembalikan data profil' , results: docs});
      }else{
        res.json({status: 'success' , message: 'Berhasil mengembalikan data profil' , results: docs});
      }


    }).catch(function(err) {
      console.log(err.stack);

      // Close the connection
      db.close();

      res.json({status: 'failed' , message: 'failed'});
    });

    //res.json({status: 'fai' , message: userId});
})
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

router.post('/daftar_guru', function(req, res, next) {
  var email = req.body.email
  var username = req.body.username
  var nama_lengkap = req.body.nama_lengkap
  var jenis_kelamin = req.body.jenis_kelamin
  var sandi = req.body.sandi
  var sekolah = req.body.sekolah

  if(email == "" || username == "" || nama_lengkap == "" || jenis_kelamin == "" || sandi == "" || sekolah == ""){
    res.json({status: 'failed' , message: 'Mohon isi semua field yang dibutuhkan'});
  }else{

  co(function*() {
    // Connection URL

    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(alamatMongoDB);
    //console.log('Berhasil koneksi ke database');


    var col = db.collection('pengguna');
    //var docs = yield col.find({email: req.body.email , sandi: req.body.password}).toArray();
    var docs = yield col.insertOne({
      id: 2,
      email: email,
      sandi: sandi,
      peran: 4,
      sekolah: parseInt(sekolah),
      point: 0,
      profil: {
        username: username,
        nama_lengkap: nama_lengkap,
        jenis_kelamin: jenis_kelamin,
        profile_picture: '',
        bio: ''
      },
      profil_game: {
        level_pengguna: 0,
        skill: 'Newbie',
        experience: 0,
        penghargaan: []
      },
      mobile_session: '',
      remember_token: '',
      created_at: moment().toDate(),
      updated_at: moment().toDate()
    });

    //mengembalikan data pengguna untuk session
    // Find the collection users
    var col2 = db.collection('pengguna');
    var docs2 = yield col.find({email: email , sandi: sandi}).toArray();

    // Close the connection
    db.close();

    if(docs2 == null || docs2 == ''){
      res.json({status: 'failed' , message: 'Gagal mendaftar', results: docs2});
    }else{
      res.json({status: 'success' , message: 'Berhasil mendaftar', results: docs2});
    }

  }).catch(function(err) {
    console.log(err.stack);

    // Close the connection
    db.close();

    res.json({status: 'failed' , message: 'Bermasalah pada server.'});
  });

}
});

router.group("/kirim", (router) => {

    router.post("/status", function(req, res, next) {
      var status = req.body.status

      if(status == ""){
        res.json({status: 'failed' , message: 'Mohon isi status yang ingin anda kirim.'});
      }else{

        co(function*() {
          // Use connect method to connect to the Server
          var db = yield MongoClient.connect(alamatMongoDB);
          //console.log('Berhasil koneksi ke database');

          var col = db.collection('kegiatan');
          //var docs = yield col.find({email: req.body.email , sandi: req.body.password}).toArray();
          var docs = yield col.insertOne({
            id_pengguna: 1234567890,
            hashtag : 0,
            deskripsi: status,
            lokasi: null,
            created_at: moment().toDate(),
            updated_at: moment().toDate()
          });
          console.log('hasilnya:'+docs)
          db.close()
          /*if(docs == null || docs == ''){
            res.json({status: 'failed' , message: 'Gagal posting'});
          }else{*/
            res.json({status: 'success' , message: 'Berhasil posting'});
          //}


        }).catch(function(err) {
          console.log(err.stack);

          // Close the connection
          db.close();


          res.json({status: 'failed' , message: 'Bermasalah pada server.'});
          });
      }

    });

});

module.exports = router;
