//Import model
var Pengguna = require('../models/userModel');
var Sekolah = require('../models/schoolModel');
var Kelas = require('../models/classModel');
var async = require('async');
var restClient = require('node-rest-client').Client;
var rClient = new restClient();
var base_api_general_url = 'http://apigeneral.vidyanusa.id';

function randomKodeKelas() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.daftar_sekolah = function(req,res,next) {

  Sekolah.find()
   .sort([['nama_sekolah', 'ascending']])
   .exec(function (err, schools) {
     if (err) { return next(err); }

     res.json({success: true, data: schools})

   });

}

exports.daftar_sekolah_pengguna = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Id sekolah tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('pengguna').escape();


  req.sanitize('access_token').trim();
  req.sanitize('pengguna').trim();


  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{

    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

      rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
        if(data.success == true){//session berlaku

          Pengguna.find({'_id':req.body.pengguna})
           .select('sekolah')
           .exec(function (err, schools) {
             if (err) { return next(err); }

             res.json({success: true, data: schools})

           });

        }else{//session tidak berlaku
          return res.json({success: false, data: {message:'Token tidak berlaku'}})
        }
      })
}
}

exports.daftar_kelas = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('id_sekolah', 'Id sekolah tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('id_sekolah').escape();


  req.sanitize('access_token').trim();
  req.sanitize('id_sekolah').trim();


  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        var idSekolah = req.body.id_sekolah

        Kelas.find({'sekolah':idSekolah})
         .sort([['created_at', 'descending']])
         .populate('sekolah','nama_sekolah')
         .populate('mapel','nama_mapel')
         .exec(function (err, clasess) {
           if (err) { return next(err); }

           res.json({success: true, data: clasess})

         });

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }


    })

  }


}

exports.daftar_kelas_guru = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('pengguna').escape();


  req.sanitize('access_token').trim();
  req.sanitize('pengguna').trim();


  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        var idPengguna = req.body.pengguna

        Pengguna.find({'_id':idPengguna})
         .select('mengajar')
         .populate('mengajar.kelas','nama_kelas')
         .populate('mengajar.mapel','nama_mapel')
         .exec(function (err, clasess) {
           if (err) { return next(err); }

           res.json({success: true, data: clasess})

         });

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }


    })

  }


}

exports.tambah_kelas = function(req,res,next){

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('nama_kelas', 'Nama kelas tidak boleh kosong').notEmpty();
  req.checkBody('sekolah', 'Id sekolah tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('nama_kelas').escape();
  req.sanitize('sekolah').escape();

  req.sanitize('access_token').trim();
  req.sanitize('nama_kelas').trim();
  req.sanitize('sekolah').trim();


  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //cek session
    args = {
        data: {
          access_token: req.body.access_token},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku
        var generateKodeKelas = randomKodeKelas()
        //Fungsi tambah kelas
        var inputan = new Kelas(
          {
            nama_kelas: req.body.nama_kelas,
            sekolah: req.body.sekolah,
            kode: generateKodeKelas
          }
        );

        inputan.save(function(err){
          if (err) {
            return res.json({success: false, data: {message:err}})
          } else {
            return res.json({success: true, data: {message:'Kelas berhasil ditambahkan'}})
          }
        })


      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }
    })

  }

}

exports.pengguna_guru_sekolah = function(req,res,next) {
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('id_sekolah', 'Id sekolah tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('id_sekolah').escape();

  req.sanitize('access_token').trim();
  req.sanitize('id_sekolah').trim();

  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{

    args = {
      	data: {
          access_token: req.body.access_token},
      	  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {

      if(data.success == true){//session berlaku

        var idSekolah = req.body.id_sekolah

        Pengguna.find({'peran':4,'sekolah':idSekolah})
         .sort([['profil.nama_lengkap', 'ascending']])
         .exec(function (err, teachers) {
           if (err) { return next(err); }

           res.json({success: true, data: teachers})

         });

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }

    })

  }

}

exports.kelas_detail = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('id_kelas', 'Id kelas tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('id_kelas').escape();


  req.sanitize('access_token').trim();
  req.sanitize('id_kelas').trim();


  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        var idKelas = req.body.id_kelas

        Kelas.find({'_id':idKelas})
         .populate('mapel','nama_mapel')
         .populate('pengajar.guru','profil.nama_lengkap')
         .populate('pengajar.mapel','nama_mapel')
         .exec(function (err, clasess) {
           if (err) { return next(err); }

           res.json({success: true, data: clasess})

         });

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }


    })

  }


}

exports.kelas_detail_ubah_nama = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kelas', 'Id kelas tidak boleh kosong').notEmpty();
  req.checkBody('nama', 'Nama kelas tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('kelas').escape();
  req.sanitize('nama').escape();

  req.sanitize('access_token').trim();
  req.sanitize('kelas').trim();
  req.sanitize('nama').trim();

  console.log('TOKEN yang diterima:'+req.body.access_token)
  console.log('ID KELAS yang diterima:'+req.body.kelas)
  console.log('NAMA yang diterima:'+req.body.nama)
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        var idKelas = req.body.id_kelas

        Kelas.findOne({ id: idKelas }, function (err, doc){
          if(err)
            return res.json({success: false, data: {message:err}})

          doc.nama_kelas = req.body.nama
          //doc.visits.$inc();
          doc.save();
          return res.json({success: true, data: {message:'Detail nama berhasil diubah.'}})
        })


      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }


    })

  }


}

exports.kelas_detail_ubah_mapel = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kelas', 'Id kelas tidak boleh kosong').notEmpty();
  req.checkBody('mapel', 'Mata pelajaran tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('kelas').escape();
  req.sanitize('mapel').escape();

  req.sanitize('access_token').trim();
  req.sanitize('kelas').trim();
  req.sanitize('mapel').trim();

  // console.log('TOKEN yang diterima:'+req.body.access_token)
  // console.log('ID KELAS yang diterima:'+req.body.kelas)
  // console.log('NAMA yang diterima:'+req.body.nama)
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku
        var idKelas = req.body.kelas
        var idMapel = req.body.mapel

        //Proses:
        //1. Dicek dahulu apakah mapel sudah ada
        //2. Apabila sudah maka gagal menambahkan
        //3. Apabila belum berhasil menambahkan
        Kelas.find({ _id: idKelas,mapel: idMapel }).exec(function (err, results) {

          var count = results.length
          if(count > 0){//Mapel sudah terdaftar di kelas
            return res.json({success: false, data: {message:'Gagal menambahkan mata pelajaran karena sudah terdaftar di kelas.'}})
          }else if(count == 0){//Mapel belum terdaftar di kelas
            //Menambahkan mapel ke kelas
            Kelas.update(
                { _id: idKelas },
                { $push: { mapel: idMapel } }
            ).exec(function (err, results) {
              if(err){
               return res.json({success: false, data: {message:err}})
             }else{
               return res.json({success: true, data: {message:'Berhasil menambahkan mata pelajaran.'}})
             }
            })


          }

        })


      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }


    })

  }


}

exports.kelas_detail_ubah_guru = function(req,res,next) {

  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kelas', 'Id kelas tidak boleh kosong').notEmpty();
  req.checkBody('guru', 'Id guru tidak boleh kosong').notEmpty();
  req.checkBody('mapel', 'Mata pelajaran tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('kelas').escape();
  req.sanitize('guru').escape();
  req.sanitize('mapel').escape();

  req.sanitize('access_token').trim();
  req.sanitize('kelas').trim();
  req.sanitize('guru').trim();
  req.sanitize('mapel').trim();

  // console.log('TOKEN yang diterima:'+req.body.access_token)
  // console.log('ID KELAS yang diterima:'+req.body.kelas)
  // console.log('NAMA yang diterima:'+req.body.nama)
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    args = {
      	data: {
          access_token: req.body.access_token},
      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku
        var idKelas = req.body.kelas
        var idMapel = req.body.mapel
        var idGuru = req.body.guru

        //Proses:
        //1. Dicek dahulu apakah mapel dan guru sudah ada dalam array
        //2. Apabila sudah maka gagal menambahkan
        //3. Apabila belum berhasil menambahkan
        Kelas.find({ _id:idKelas , pengajar: {$elemMatch:{mapel:idMapel,guru:idGuru}} }).exec(function (err, results) {

          var count = results.length
          if(count > 0){//Mapel dan Guru sudah terdaftar di kelas
            return res.json({success: false, data: {message:'Gagal menambahkan guru ke mata pelajaran karena sudah terdaftar di kelas.'}})
          }else if(count == 0){//Mapel belum terdaftar di kelas
            //Menambahkan guru ke kelas
            var guruMapel = { guru: idGuru, mapel: idMapel }

            Kelas.update(
                { _id: idKelas },
                { $push: { pengajar: guruMapel } }
            ).exec(function (err, results) {
              if(err){
               return res.json({success: false, data: {message:err}})
             }else{
               //Menambahkan mapel dan kelas ke guru
               var kelasMapel = { kelas: idKelas, mapel: idMapel }

               Pengguna.update(
                 { _id: idGuru },
                 { $push: { mengajar: kelasMapel } }
               ).exec(function(err, results) {
                 if(err){
                   return res.json({success: false, data: {message:err}})
                 }else{
                   return res.json({success: true, data: {message:'Berhasil menambahkan guru ke kelas.'}})
                 }
               })


             }
            })


          }

        })


      }else{//session tidak berlaku
        return res.json({success: false, data: {message:'Token tidak berlaku'}})
      }


    })

  }


}
