//Import model
var logs = require('../models/logModel');
var User = require('../models/userModel');//user guru
var Poin = require('../models/poinModel');
var UserSiswa = require('../models/userModelSiswa');//user siswa
var Session = require('../models/sessionModel');
var Class = require('../models/classModel');

//import library
var async = require('async');
var moment = require('moment');
var restClient = require('node-rest-client').Client;
var rClient = new restClient();

var base_api_general_url = 'http://apigeneral.vidyanusa.id'


exports.post_log = function(req,res){

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('id_pengguna', 'Id_pengguna tidak boleh kosong ').notEmpty();
    req.checkBody('tipe', 'Tipe tidak boleh kosong isi dengan angka 1.LMS 2.Forum 3.Game 4.Portal 5.Blog').notEmpty();
    req.checkBody('judul', 'judul tidak boleh kosong').notEmpty();
    
    req.sanitize('access_token').escape();
    req.sanitize('access_token').trim();

     //Menjalankan validasi
    var errors = req.validationErrors();

    if(errors){//Terjadinya kesalahan

        return res.json({success: false, data: errors})

    }else{

        //Cek akses token terlebih dahulu
      args = {
              data: {
                access_token: req.body.access_token},
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
             };

      rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
        if(data.success == true){//session berlaku

          var inputan_log = new logs({
            pengguna:req.body.id_pengguna,
            tipe:req.body.tipe,
            judul:req.body.judul,
            link:req.body.link
            })
                            
          inputan_log.save(function (err){
            if (err) {
              console.log('Terjadi error di input log')
              return res.json({success: false, data: err})
            } else {
              console.log('Input log berhasil')
              return res.json({success: true, data: {message:'Log anda berhasil di tambahkan.'}})
            }
          })
  	  
       }else{//sessio tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });

  }
}

exports.daftar_logs = function(req,res) {
      
    logs.find({})
    .sort([['created_at', 'descending']])
    .populate({ path: 'pengguna', select: 'profil.username profil.foto' })
   
    .exec(function (err, results) {
      if (err) {
       return res.json({success: false, data: err})
      }else{
       return res.json({success: true, data: results}) 
      }

    });

}

exports.daftar_log_id = function(req,res) {
      
    logs.find({'pengguna':req.body.id})
    .sort([['created_at', 'descending']])
    .populate({ path: 'pengguna', select: 'profil.username profil.foto' })
   
    .exec(function (err, results) {
      if (err) {
       return res.json({success: false, data: err})
      }else{
       return res.json({success: true, data: results})
      }

    });

}

exports.daftar_log_user = function(req,res) {
      
  User.find({ 'profil.username' : req.body.username  })
  .lean()
  .distinct('_id')
  .exec((err, userIds) => {
    if (userIds.length == 0) { 
      return res.json({success: false, message: 'Username tidak terdaftar'})
    }
      logs.find({ pengguna: { $all: userIds} })
      .sort([['created_at', 'descending']])
      .populate({ path: 'pengguna', select: 'profil.username profil.foto' })
   
      .exec(function (err, results) {
        if (err) {
         return res.json({success: false, data: err})
        }else{
         return res.json({success: true, data: results})
        }

      });
     
  });

}

