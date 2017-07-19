//Import model
var User = require('../models/userModel');//user guru
var UserSiswa = require('../models/userModelSiswa');//user siswa
var Session = require('../models/sessionModel');
var Class = require('../models/classModel');

//Import library
var async = require('async');
var moment = require('moment');
var md5 = require('md5')

var salt_password = 'LkywIKIDJk'

function randomAccessToken() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 30; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.masuk = function(req,res) {

  //Inisial validasi
  req.checkBody('email', 'Mohon isi field Email').notEmpty();
  req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('email').escape();
  req.sanitize('email').trim();
  req.sanitize('sandi').escape();
  req.sanitize('sandi').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  //Membuat objek inputan sudah di validasi dan dibersihkan
  var inputan = new User(
    { email: req.body.email, sandi: req.body.sandi}
  );

  User.find({'email':inputan.email,'sandi':md5(inputan.sandi+salt_password)})
   .exec(function (err, results) {

     if (err) {
       return res.json({success: false, data: err})
     }else{

       if(results.length == 1){//Akun ditemukan
          var dataPengguna = {data: results}
          var username = dataPengguna.data[0].profil.username
          var peran = dataPengguna.data[0].peran
          var idPengguna = dataPengguna.data[0]._id

          var generateAccessToken = randomAccessToken()

          //Mengatur kembalian
          async.series({
              one: function(callback) {
                //Mencek apakah sudah ada access token untuk pengguna yang masuk
                Session.find({'user_id':idPengguna,'end_at':null})
                 .exec(function (err, results) {
                   var dataSession

                   if(results.length == 0){//Pengguna belum memiliki session dengan end date null
                     // Buat baru access token di collection session
                     var inputan = new Session(
                       {
                         user_id: idPengguna,
                         access_token: generateAccessToken,
                         platform: 'web'
                       }
                     );

                     inputan.save(function(err){
                       if (err) {
                         //return res.json({success: false, data: err})
                       } else {
                         //accessToken = generateAccessToken
                       }
                     })

                   }else if(results.length == 1){//Pengguna sudah memiliki session dengan end date null
                     // Meng ekspire kan access token
                     var dataSession = {data: results}
                     //console.log("Pjg Kembalian: "+results.length)
                     var idSession = dataSession.data[0]._id

                     Session.update({ _id: idSession }, { $set: { end_at: Date.now() }})
                      .exec(function (err, results) {
                          if (err) {

                          }else{
                            // Buat baru access token di collection session
                            var inputan = new Session(
                              {
                                user_id: idPengguna,
                                access_token: generateAccessToken,
                                platform: 'web'
                              }
                            );

                            inputan.save(function(err){
                              if (err) {
                                //return res.json({success: false, data: err})
                              } else {
                                //accessToken = generateAccessToken
                              }
                            })
                          }
                      })
                   }
                 });

                callback(null, 1);
              },
              two: function(callback){
                return res.json({success: true, data: {access_token: generateAccessToken, id_pengguna: idPengguna, username: username, peran: peran}})

                callback(null, 2);
              }
          }, function(err, results) {
              // results is now equal to: {one: 1, two: 2}
          })


       }else if(results.length == 0){//Akun tidak ditemukan
          return res.json({success: false, data: {message: 'Maaf email atau sandi anda salah.'}})
       }else{
          return res.json({success: false})
       }


     }

   });

}

exports.masuk_android = function(req,res) {

  //Inisial validasi
  req.checkBody('email', 'Mohon isi field Email').notEmpty();
  req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('email').escape();
  req.sanitize('email').trim();
  req.sanitize('sandi').escape();
  req.sanitize('sandi').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  //Membuat objek inputan sudah di validasi dan dibersihkan
  var inputan = new User(
    { email: req.body.email, sandi: req.body.sandi}
  );

  User.find({'email':inputan.email,'sandi':md5(inputan.sandi+salt_password)})
   .exec(function (err, results) {

     if (err) {
       return res.json({success: false, data: err})
     }else{

       if(results.length == 1){//Akun ditemukan
          var dataPengguna = {data: results}
          var username = dataPengguna.data[0].profil.username
          var peran = dataPengguna.data[0].peran
          var idPengguna = dataPengguna.data[0]._id

          var generateAccessToken = randomAccessToken()

          //Mengatur kembalian
          async.series({
              one: function(callback) {
                //Mencek apakah sudah ada access token untuk pengguna yang masuk
                Session.find({'user_id':idPengguna,'end_at':null})
                 .exec(function (err, results) {
                   var dataSession

                   if(results.length == 0){//Pengguna belum memiliki session dengan end date null
                     // Buat baru access token di collection session
                     var inputan = new Session(
                       {
                         user_id: idPengguna,
                         access_token: generateAccessToken,
                         platform: 'android'
                       }
                     );

                     inputan.save(function(err){
                       if (err) {
                         //return res.json({success: false, data: err})
                       } else {
                         //accessToken = generateAccessToken
                       }
                     })

                   }else if(results.length == 1){//Pengguna sudah memiliki session dengan end date null
                     // Meng ekspire kan access token
                     var dataSession = {data: results}
                     //console.log("Pjg Kembalian: "+results.length)
                     var idSession = dataSession.data[0]._id

                     Session.update({ _id: idSession }, { $set: { end_at: Date.now() }})
                      .exec(function (err, results) {
                          if (err) {

                          }else{
                            // Buat baru access token di collection session
                            var inputan = new Session(
                              {
                                user_id: idPengguna,
                                access_token: generateAccessToken,
                                platform: 'android'
                              }
                            );

                            inputan.save(function(err){
                              if (err) {
                                //return res.json({success: false, data: err})
                              } else {
                                //accessToken = generateAccessToken
                              }
                            })
                          }
                      })
                   }
                 });

                callback(null, 1);
              },
              two: function(callback){
                return res.json({success: true, data: {access_token: generateAccessToken, id_pengguna: idPengguna, username: username, peran: peran}})

                callback(null, 2);
              }
          }, function(err, results) {
              // results is now equal to: {one: 1, two: 2}
          })


       }else if(results.length == 0){//Akun tidak ditemukan
          return res.json({success: false, data: {message: 'Maaf email atau sandi anda salah.'}})
       }else{
          return res.json({success: false})
       }


     }

   });

}

exports.daftar_proses_siswa = function(req,res) {

  //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email').notEmpty();//
    req.checkBody('username', 'Mohon isi field Username').notEmpty();//
    req.checkBody('nama_lengkap', 'Mohon isi field Nama Lengkap').notEmpty();//
    req.checkBody('jenis_kelamin', 'Mohon pilih Jenis Kelamin').notEmpty();//
    req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();//
    req.checkBody('kode_kelas', 'Mohon isi field kode kelas').notEmpty();//

    //Dibersihkan dari Special Character
    req.sanitize('email').escape();
    req.sanitize('username').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('jenis_kelamin').escape();
    req.sanitize('sandi').escape();
    req.sanitize('kode_kelas').escape();

    req.sanitize('email').trim();
    req.sanitize('username').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('jenis_kelamin').trim();
    req.sanitize('sandi').trim();
    req.sanitize('kode_kelas').trim();

    //Menjalankan validasi
    var errors = req.validationErrors();

    //Eksekusi validasi
  if(errors){//Terjadinya kesalahan

      return res.json({success: false, data: errors})

  }else{//Input ke collection

    //Dicek terlebih dahulu apakah email atau password sudah terdaftar
    UserSiswa.find({$or:[{'email':req.body.email},{'profil.username':req.body.username}]})
     .exec(function (err, results) {

       if (err) {
         return res.json({success: false, data: err})
       }else{

         if(results.length == 1){//Email atau username sudah terdaftar
           return res.json({success: false, data:[{message:'Email atau username sudah terdaftar'}]})
         }else if(results.length == 0){//Email atau username bisa digunakan

           //Dicek terlebih dahulu apakah kode kelas terdaftar di collection kelas
           Class.find({'kode_kelas':req.body.kode_kelas})
            .exec(function (err, results) {
              if(results.length == 0){//Kode kelas tidak terdaftar
                return res.json({success: false, data:[{message:'Kode kelas yang anda tuliskan tidak terdaftar.'}]})
              }else if(results.length == 1){////Kode kelas terdaftar
                var dataKelas = {data: results}
                console.log('Data Kelas:'+JSON.stringify(dataKelas))
                console.log('Objek Kelas:'+dataKelas.data[0]._id)
                //Membuat objek inputan sudah di validasi dan dibersihkan
                var inputan = new UserSiswa(
                  {
                    email: req.body.email,
                    sandi: md5(req.body.sandi+salt_password),
                    peran: 3,
                    kelas: dataKelas.data[0]._id,
                    profil: {
                      username: req.body.username,
                      nama_lengkap: req.body.nama_lengkap,
                      jenis_kelamin: req.body.jenis_kelamin,
                    }
                  }
                );

                //Query simpan ke collection pengguna
                inputan.save(function(err){
                  if (err) {
                    return res.json({success: false, data: err})
                  } else {

                    //Menggunakan kembali fungsi login
                    UserSiswa.find({'email':req.body.email,'sandi':md5(req.body.sandi+salt_password)})
                     .exec(function (err, results) {

                       if (err) {
                         return res.json({success: false, data: err})
                       }else{

                         if(results.length == 1){//Akun ditemukan
                            var dataPengguna = {data: results}
                            var username = dataPengguna.data[0].profil.username
                            var peran = dataPengguna.data[0].peran
                            var idPengguna = dataPengguna.data[0]._id

                            var generateAccessToken = randomAccessToken()

                            //Mengatur kembalian
                            async.series({
                                one: function(callback) {
                                  //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                  Session.find({'user_id':idPengguna,'end_at':null})
                                   .exec(function (err, results) {
                                     var dataSession

                                     if(results.length == 0){//Pengguna belum memiliki session dengan end date null
                                       // Buat baru access token di collection session
                                       var inputan = new Session(
                                         {
                                           user_id: idPengguna,
                                           access_token: generateAccessToken,
                                           platform: 'web'
                                         }
                                       );

                                       inputan.save(function(err){
                                         if (err) {
                                           //return res.json({success: false, data: err})
                                         } else {
                                           //accessToken = generateAccessToken
                                         }
                                       })

                                     }else if(results.length == 1){//Pengguna sudah memiliki session dengan end date null
                                       // Meng ekspire kan access token
                                       var dataSession = {data: results}
                                       //console.log("Pjg Kembalian: "+results.length)
                                       var idSession = dataSession.data[0]._id

                                       Session.update({ _id: idSession }, { $set: { end_at: Date.now() }})
                                        .exec(function (err, results) {
                                            if (err) {

                                            }else{
                                              // Buat baru access token di collection session
                                              var inputan = new Session(
                                                {
                                                  user_id: idPengguna,
                                                  access_token: generateAccessToken,
                                                  platform: 'web'
                                                }
                                              );

                                              inputan.save(function(err){
                                                if (err) {
                                                  //return res.json({success: false, data: err})
                                                } else {
                                                  //accessToken = generateAccessToken
                                                }
                                              })
                                            }
                                        })
                                     }
                                   });

                                  callback(null, 1);
                                },
                                two: function(callback){
                                  return res.json({success: true, data: {access_token: generateAccessToken, id_pengguna: idPengguna, username: username, peran: peran}})

                                  callback(null, 2);
                                }
                            }, function(err, results) {
                                // results is now equal to: {one: 1, two: 2}
                            })


                         }else if(results.length == 0){//Akun tidak ditemukan
                            return res.json({success: false, data: {message: 'Maaf email atau sandi anda salah.'}})
                         }else{
                            return res.json({success: false})
                         }
                       }
                     });

                    //return res.json({success: true, data: {username: inputan.username}})
                  }
                })

              }
            })



         }
       }

     });

  }

}

exports.daftar_proses_siswa_android = function(req,res) {

  //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email').notEmpty();//
    req.checkBody('username', 'Mohon isi field Username').notEmpty();//
    req.checkBody('nama_lengkap', 'Mohon isi field Nama Lengkap').notEmpty();//
    req.checkBody('jenis_kelamin', 'Mohon pilih Jenis Kelamin').notEmpty();//
    req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();//
    req.checkBody('kode_kelas', 'Mohon isi field kode kelas').notEmpty();//

    //Dibersihkan dari Special Character
    req.sanitize('email').escape();
    req.sanitize('username').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('jenis_kelamin').escape();
    req.sanitize('sandi').escape();
    req.sanitize('kode_kelas').escape();

    req.sanitize('email').trim();
    req.sanitize('username').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('jenis_kelamin').trim();
    req.sanitize('sandi').trim();
    req.sanitize('kode_kelas').trim();

    //Menjalankan validasi
    var errors = req.validationErrors();

    //Eksekusi validasi
  if(errors){//Terjadinya kesalahan

      return res.json({success: false, data: errors})

  }else{//Input ke collection

    //Dicek terlebih dahulu apakah email atau password sudah terdaftar
    UserSiswa.find({$or:[{'email':req.body.email},{'profil.username':req.body.username}]})
     .exec(function (err, results) {

       if (err) {
         return res.json({success: false, data: err})
       }else{

         if(results.length == 1){//Email atau username sudah terdaftar
           return res.json({success: false, data:[{message:'Email atau username sudah terdaftar'}]})
         }else if(results.length == 0){//Email atau username bisa digunakan

           //Dicek terlebih dahulu apakah kode kelas terdaftar di collection kelas
           Class.find({'kode_kelas':req.body.kode_kelas})
            .exec(function (err, results) {
              if(results.length == 0){//Kode kelas tidak terdaftar
                return res.json({success: false, data:[{message:'Kode kelas yang anda tuliskan tidak terdaftar.'}]})
              }else if(results.length == 1){////Kode kelas terdaftar
                var dataKelas = {data: results}
                console.log('Data Kelas:'+JSON.stringify(dataKelas))
                console.log('Objek Kelas:'+dataKelas.data[0]._id)
                //Membuat objek inputan sudah di validasi dan dibersihkan
                var inputan = new UserSiswa(
                  {
                    email: req.body.email,
                    sandi: md5(req.body.sandi+salt_password),
                    peran: 3,
                    kelas: dataKelas.data[0]._id,
                    profil: {
                      username: req.body.username,
                      nama_lengkap: req.body.nama_lengkap,
                      jenis_kelamin: req.body.jenis_kelamin,
                    }
                  }
                );

                //Query simpan ke collection pengguna
                inputan.save(function(err){
                  if (err) {
                    return res.json({success: false, data: err})
                  } else {

                    //Menggunakan kembali fungsi login
                    UserSiswa.find({'email':req.body.email,'sandi':md5(req.body.sandi+salt_password)})
                     .exec(function (err, results) {

                       if (err) {
                         return res.json({success: false, data: err})
                       }else{

                         if(results.length == 1){//Akun ditemukan
                            var dataPengguna = {data: results}
                            var username = dataPengguna.data[0].profil.username
                            var peran = dataPengguna.data[0].peran
                            var idPengguna = dataPengguna.data[0]._id

                            var generateAccessToken = randomAccessToken()

                            //Mengatur kembalian
                            async.series({
                                one: function(callback) {
                                  //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                  Session.find({'user_id':idPengguna,'end_at':null})
                                   .exec(function (err, results) {
                                     var dataSession

                                     if(results.length == 0){//Pengguna belum memiliki session dengan end date null
                                       // Buat baru access token di collection session
                                       var inputan = new Session(
                                         {
                                           user_id: idPengguna,
                                           access_token: generateAccessToken,
                                           platform: 'android'
                                         }
                                       );

                                       inputan.save(function(err){
                                         if (err) {
                                           //return res.json({success: false, data: err})
                                         } else {
                                           //accessToken = generateAccessToken
                                         }
                                       })

                                     }else if(results.length == 1){//Pengguna sudah memiliki session dengan end date null
                                       // Meng ekspire kan access token
                                       var dataSession = {data: results}
                                       //console.log("Pjg Kembalian: "+results.length)
                                       var idSession = dataSession.data[0]._id

                                       Session.update({ _id: idSession }, { $set: { end_at: Date.now() }})
                                        .exec(function (err, results) {
                                            if (err) {

                                            }else{
                                              // Buat baru access token di collection session
                                              var inputan = new Session(
                                                {
                                                  user_id: idPengguna,
                                                  access_token: generateAccessToken,
                                                  platform: 'android'
                                                }
                                              );

                                              inputan.save(function(err){
                                                if (err) {
                                                  //return res.json({success: false, data: err})
                                                } else {
                                                  //accessToken = generateAccessToken
                                                }
                                              })
                                            }
                                        })
                                     }
                                   });

                                  callback(null, 1);
                                },
                                two: function(callback){
                                  return res.json({success: true, data: {access_token: generateAccessToken, id_pengguna: idPengguna, username: username, peran: peran}})

                                  callback(null, 2);
                                }
                            }, function(err, results) {
                                // results is now equal to: {one: 1, two: 2}
                            })


                         }else if(results.length == 0){//Akun tidak ditemukan
                            return res.json({success: false, data: {message: 'Maaf email atau sandi anda salah.'}})
                         }else{
                            return res.json({success: false})
                         }
                       }
                     });

                    //return res.json({success: true, data: {username: inputan.username}})
                  }
                })

              }
            })



         }
       }

     });

  }

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
        sandi: md5(req.body.sandi+salt_password),
        peran: 4,
        sekolah: req.body.sekolah,
        profil: {
          username: req.body.username,
          nama_lengkap: req.body.nama_lengkap,
          jenis_kelamin: req.body.jenis_kelamin,
          profil_picture: '',
          bio: ''
        }
      }
    );

    //Eksekusi validasi
  if(errors){//Terjadinya kesalahan

      return res.json({success: false, data: errors})

  }else{//Input ke collection

    //Dicek terlebih dahulu apakah email atau password sudah terdaftar
    //User.find({'email':req.body.email,'username':md5(inputan.sandi+salt_password)})
    User.find({$or:[{'email':req.body.email},{'profil.username':req.body.username}]})
     .exec(function (err, results) {

       if (err) {
         return res.json({success: false, data: err})
       }else{

         if(results.length == 1){//Email atau username sudah terdaftar
           return res.json({success: false, data:[{message:'Email atau username sudah terdaftar'}]})
         }else if(results.length == 0){//Email atau username bisa digunakan
           //Query simpan ke collection pengguna
           inputan.save(function(err){
             if (err) {
               return res.json({success: false, data: err})
             } else {

               //Menggunakan kembali fungsi login
               User.find({'email':req.body.email,'sandi':md5(req.body.sandi+salt_password)})
                .exec(function (err, results) {

                  if (err) {
                    return res.json({success: false, data: err})
                  }else{

                    if(results.length == 1){//Akun ditemukan
                       var dataPengguna = {data: results}
                       var username = dataPengguna.data[0].profil.username
                       var peran = dataPengguna.data[0].peran
                       var idPengguna = dataPengguna.data[0]._id

                       var generateAccessToken = randomAccessToken()

                       //Mengatur kembalian
                       async.series({
                           one: function(callback) {
                             //Mencek apakah sudah ada access token untuk pengguna yang masuk
                             Session.find({'user_id':idPengguna,'end_at':null})
                              .exec(function (err, results) {
                                var dataSession

                                if(results.length == 0){//Pengguna belum memiliki session dengan end date null
                                  // Buat baru access token di collection session
                                  var inputan = new Session(
                                    {
                                      user_id: idPengguna,
                                      access_token: generateAccessToken,
                                      platform: 'web'
                                    }
                                  );

                                  inputan.save(function(err){
                                    if (err) {
                                      //return res.json({success: false, data: err})
                                    } else {
                                      //accessToken = generateAccessToken
                                    }
                                  })

                                }else if(results.length == 1){//Pengguna sudah memiliki session dengan end date null
                                  // Meng ekspire kan access token
                                  var dataSession = {data: results}
                                  //console.log("Pjg Kembalian: "+results.length)
                                  var idSession = dataSession.data[0]._id

                                  Session.update({ _id: idSession }, { $set: { end_at: Date.now() }})
                                   .exec(function (err, results) {
                                       if (err) {

                                       }else{
                                         // Buat baru access token di collection session
                                         var inputan = new Session(
                                           {
                                             user_id: idPengguna,
                                             access_token: generateAccessToken,
                                             platform: 'web'
                                           }
                                         );

                                         inputan.save(function(err){
                                           if (err) {
                                             //return res.json({success: false, data: err})
                                           } else {
                                             //accessToken = generateAccessToken
                                           }
                                         })
                                       }
                                   })
                                }
                              });

                             callback(null, 1);
                           },
                           two: function(callback){
                             return res.json({success: true, data: {access_token: generateAccessToken, id_pengguna: idPengguna, username: username, peran: peran}})

                             callback(null, 2);
                           }
                       }, function(err, results) {
                           // results is now equal to: {one: 1, two: 2}
                       })


                    }else if(results.length == 0){//Akun tidak ditemukan
                       return res.json({success: false, data: {message: 'Maaf email atau sandi anda salah.'}})
                    }else{
                       return res.json({success: false})
                    }
                  }
                });

               //return res.json({success: true, data: {username: inputan.username}})
             }
           })

         }
       }

     });

  }

}

exports.daftar_proses_guru_android = function(req,res) {

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
        sandi: md5(req.body.sandi+salt_password),
        peran: 4,
        sekolah: req.body.sekolah,
        profil: {
          username: req.body.username,
          nama_lengkap: req.body.nama_lengkap,
          jenis_kelamin: req.body.jenis_kelamin,
          profil_picture: '',
          bio: ''
        }
      }
    );

    //Eksekusi validasi
  if(errors){//Terjadinya kesalahan

      return res.json({success: false, data: errors})

  }else{//Input ke collection

    //Dicek terlebih dahulu apakah email atau password sudah terdaftar
    //User.find({'email':req.body.email,'username':md5(inputan.sandi+salt_password)})
    User.find({$or:[{'email':req.body.email},{'profil.username':req.body.username}]})
     .exec(function (err, results) {

       if (err) {
         return res.json({success: false, data: err})
       }else{

         if(results.length == 1){//Email atau username sudah terdaftar
           return res.json({success: false, data:[{message:'Email atau username sudah terdaftar'}]})
         }else if(results.length == 0){//Email atau username bisa digunakan
           //Query simpan ke collection pengguna
           inputan.save(function(err){
             if (err) {
               return res.json({success: false, data: err})
             } else {

               //Menggunakan kembali fungsi login
               User.find({'email':req.body.email,'sandi':md5(req.body.sandi+salt_password)})
                .exec(function (err, results) {

                  if (err) {
                    return res.json({success: false, data: err})
                  }else{

                    if(results.length == 1){//Akun ditemukan
                       var dataPengguna = {data: results}
                       var username = dataPengguna.data[0].profil.username
                       var peran = dataPengguna.data[0].peran
                       var idPengguna = dataPengguna.data[0]._id

                       var generateAccessToken = randomAccessToken()

                       //Mengatur kembalian
                       async.series({
                           one: function(callback) {
                             //Mencek apakah sudah ada access token untuk pengguna yang masuk
                             Session.find({'user_id':idPengguna,'end_at':null})
                              .exec(function (err, results) {
                                var dataSession

                                if(results.length == 0){//Pengguna belum memiliki session dengan end date null
                                  // Buat baru access token di collection session
                                  var inputan = new Session(
                                    {
                                      user_id: idPengguna,
                                      access_token: generateAccessToken,
                                      platform: 'android'
                                    }
                                  );

                                  inputan.save(function(err){
                                    if (err) {
                                      //return res.json({success: false, data: err})
                                    } else {
                                      //accessToken = generateAccessToken
                                    }
                                  })

                                }else if(results.length == 1){//Pengguna sudah memiliki session dengan end date null
                                  // Meng ekspire kan access token
                                  var dataSession = {data: results}
                                  //console.log("Pjg Kembalian: "+results.length)
                                  var idSession = dataSession.data[0]._id

                                  Session.update({ _id: idSession }, { $set: { end_at: Date.now() }})
                                   .exec(function (err, results) {
                                       if (err) {

                                       }else{
                                         // Buat baru access token di collection session
                                         var inputan = new Session(
                                           {
                                             user_id: idPengguna,
                                             access_token: generateAccessToken,
                                             platform: 'android'
                                           }
                                         );

                                         inputan.save(function(err){
                                           if (err) {
                                             //return res.json({success: false, data: err})
                                           } else {
                                             //accessToken = generateAccessToken
                                           }
                                         })
                                       }
                                   })
                                }
                              });

                             callback(null, 1);
                           },
                           two: function(callback){
                             return res.json({success: true, data: {access_token: generateAccessToken, id_pengguna: idPengguna, username: username, peran: peran}})

                             callback(null, 2);
                           }
                       }, function(err, results) {
                           // results is now equal to: {one: 1, two: 2}
                       })


                    }else if(results.length == 0){//Akun tidak ditemukan
                       return res.json({success: false, data: {message: 'Maaf email atau sandi anda salah.'}})
                    }else{
                       return res.json({success: false})
                    }
                  }
                });

               //return res.json({success: true, data: {username: inputan.username}})
             }
           })

         }
       }

     });

  }

}

exports.get_profile = function(req,res,next) {

  if(req.body.username == '' || req.body.access_token == '' || req.body.username == null || req.body.access_token == null){
    return res.json({success: false, data: {message:'Username atau akses token tidak boleh kosong'}})
  }else{

    User.find({'profil.username':req.body.username})//inputan.username
    .exec(function (err, results) {
      var expire = false
      //Mengatur alur REST
      async.series({
          one: function(callback) {

            setTimeout(function() {
              //Mencek apakah access token yang dimiliki pengguna masih berlaku
              Session.find({'access_token':req.body.access_token,'end_at':null})
               .exec(function (err, results) {


                 if(results.length == 0){//Sudah expired akses tokennya
                   expire = true;
                   console.log('Status expire jadi:'+expire)
                 }

               });
              callback(null, 1);
            }, 1000);


          },
          two: function(callback){

            setTimeout(function() {
              if (err) {
                return res.json({success: false, data: err})
              }else{
                console.log('Status expire jadinya:'+expire)
                if(expire == true){
                  return res.json({success: false, data: {message:'Akses token sudah expired atau tidak ditemukan'}})
                }else if(expire == false){
                  if(results.length == 0){
                    return res.json({success: false,data:{message:'Data profil tidak ditemukan'}})
                  }else{
                    return res.json({success: true, data: results, expire: expire})
                  }
                }
              }
              callback(null, 2);
            }, 1000);

          }
      }, function(err, results) {

      })

    });

  }

}

exports.keluar = function(req,res) {
  if(req.body.access_token == null){
    return res.json({success:false,message:'Parameter akses token tidak boleh kosong'})
  }else{
    Session.update({ access_token: req.body.access_token }, { $set: { end_at: Date.now() }})
     .exec(function (err, results) {
         if (err) {
           return res.json({success:false})
         }else{
           return res.json({success:true})
         }
     })
  }


}
