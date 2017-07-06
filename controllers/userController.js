//Import model
var User = require('../models/userModel');
var async = require('async');
var moment = require('moment');

exports.masuk = function(req,res) {

  //Inisial validasi
  req.checkBody('email', 'Mohon isi field Email').notEmpty();
  req.checkBody('password', 'Mohon isi field Password').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('email').escape();
  req.sanitize('email').trim();
  req.sanitize('password').escape();
  req.sanitize('password').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  //Membuat objek inputan sudah di validasi dan dibersihkan
  var inputan = new User(
    { email: req.body.email, password: req.body.password}
  );

  User.find({'email':email,'sandi':sandi})
   .exec(function (err, users) {

     if (err) {
       //return next(err);
       return res.json({success: false, msg: err})
     }

     return res.json({success: true})

   });

}

exports.daftar_proses_guru = function(req,res) {

  //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email').notEmpty();
    req.checkBody('username', 'Mohon isi field Username').notEmpty();
    req.checkBody('nama_lengkap', 'Mohon isi field Nama Lengkap').notEmpty();
    req.checkBody('jenis_kelamin', 'Mohon pilih Jenis Kelamin').notEmpty();
    req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();
    req.checkBody('sekolah', 'Mohon pilih field Sekolah').notEmpty();

    //Dibersihkan dari Special Character
    req.sanitize('email').escape();
    req.sanitize('username').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('jenis_kelamin').escape();
    req.sanitize('sandi').escape();
    req.sanitize('sekolah').escape();

    req.sanitize('email').trim();
    req.sanitize('username').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('jenis_kelamin').trim();
    req.sanitize('sandi').trim();
    req.sanitize('sekolah').trim();

    //Menjalankan validasi
    var errors = req.validationErrors();

    //Membuat objek inputan sudah di validasi dan dibersihkan

    var inputan = new User(
      {
        email: req.body.email,
        sandi: req.body.sandi,
        peran: 4,
        sekolah: req.body.sekolah,
        profil: {
          username: req.body.username,
          nama_lengkap: req.body.nama_lengkap,
          jenis_kelamin: req.body.jenis_kelamin,
          profil_picture: '',
          bio: ''
        },
        mobile_session: '',
        remember_token: '',
        created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
        updated_at: moment().format('MMMM Do YYYY, h:mm:ss a')
      }
    );

    //Eksekusi validasi
  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{//Input ke collection
    //Query ke collection
    inputan.save(function(err){
      if (err) {
        return res.json({success: false, data: err})
      } else {
        return res.json({success: true, data: {username: inputan.username}})
      }
    })

  }

}
