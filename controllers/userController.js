//Import model
var User = require('../models/userModel');//user guru
var Poin = require('../models/poinModel');
var UserSiswa = require('../models/userModelSiswa');//user siswa
var Session = require('../models/sessionModel');
var Class = require('../models/classModel');

//Import library

var async = require('async');
var moment = require('moment');
var md5 = require('md5')
var restClient = require('node-rest-client').Client;
//var rClient = new restClient();
var rClient = new restClient({
    proxy: {
        host: "",
        port: ,
        user: "",
        password: ""
    }
});
var base_api_general_url = 'http://apigeneral.vidyanusa.id';

var salt_password = 'LkywIKIDJk'

//Untuk mengirim email
var nodemailer = require('nodemailer')

function randomAccessToken() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function randomPasswordMurni() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.masuk = function (req, res) {

    //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email atau Username').notEmpty();
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
        {email: req.body.email, sandi: req.body.sandi}
    );

    User.find({'email': inputan.email, 'sandi': md5(inputan.sandi + salt_password)})
        .exec(function (err, results) {

            if (err) {
                return res.json({success: false, data: err})
            } else {

                if (results.length == 1) {//Akun ditemukan

                    var dataPengguna = {data: results}
                    var username = dataPengguna.data[0].profil.username
                    var peran = dataPengguna.data[0].peran
                    var idPengguna = dataPengguna.data[0]._id

                    var generateAccessToken = randomAccessToken()

                    //Mengatur kembalian
                    async.series({
                        one: function (callback) {
                            //Mencek apakah sudah ada access token untuk pengguna yang masuk
                            Session.find({'user_id': idPengguna, 'end_at': null, 'platform': 'web'})
                                .exec(function (err, results) {
                                    var dataSession

                                    if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                        // Buat baru access token di collection session
                                        var inputan = new Session(
                                            {
                                                user_id: idPengguna,
                                                access_token: generateAccessToken,
                                                platform: 'web'
                                            }
                                        );

                                        inputan.save(function (err) {
                                            if (err) {
                                                //return res.json({success: false, data: err})
                                            } else {
                                                //accessToken = generateAccessToken
                                            }
                                        })

                                    } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                        // Meng ekspire kan access token
                                        var dataSession = {data: results}
                                        //console.log("Pjg Kembalian: "+results.length)
                                        var idSession = dataSession.data[0]._id

                                        Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                            .exec(function (err, results) {
                                                if (err) {

                                                } else {
                                                    // Buat baru access token di collection session
                                                    var inputan = new Session(
                                                        {
                                                            user_id: idPengguna,
                                                            access_token: generateAccessToken,
                                                            platform: 'web'
                                                        }
                                                    );

                                                    inputan.save(function (err) {
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
                        two: function (callback) {
                            return res.json({
                                success: true,
                                data: {
                                    access_token: generateAccessToken,
                                    id_pengguna: idPengguna,
                                    username: username,
                                    peran: peran
                                }
                            })

                            callback(null, 2);
                        }
                    }, function (err, results) {
                        // results is now equal to: {one: 1, two: 2}
                    })


                } else if (results.length == 0) {//Akun tidak ditemukan


                    //Jalankan fungsi login dengan username
                    User.find({'profil.username': inputan.email, 'sandi': md5(inputan.sandi + salt_password)})
                        .exec(function (err, results) {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {
                                if (results.length == 1) {//Akun ditemukan

                                    var dataPengguna = {data: results}
                                    var username = dataPengguna.data[0].profil.username
                                    var peran = dataPengguna.data[0].peran
                                    var idPengguna = dataPengguna.data[0]._id

                                    var generateAccessToken = randomAccessToken()

                                    //Mengatur kembalian
                                    async.series({
                                        one: function (callback) {
                                            //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                            Session.find({'user_id': idPengguna, 'end_at': null, 'platform': 'web'})
                                                .exec(function (err, results) {
                                                    var dataSession

                                                    if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                                        // Buat baru access token di collection session
                                                        var inputan = new Session(
                                                            {
                                                                user_id: idPengguna,
                                                                access_token: generateAccessToken,
                                                                platform: 'web'
                                                            }
                                                        );

                                                        inputan.save(function (err) {
                                                            if (err) {
                                                                //return res.json({success: false, data: err})
                                                            } else {
                                                                //accessToken = generateAccessToken
                                                            }
                                                        })

                                                    } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                                        // Meng ekspire kan access token
                                                        var dataSession = {data: results}
                                                        //console.log("Pjg Kembalian: "+results.length)
                                                        var idSession = dataSession.data[0]._id

                                                        Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                                            .exec(function (err, results) {
                                                                if (err) {

                                                                } else {
                                                                    // Buat baru access token di collection session
                                                                    var inputan = new Session(
                                                                        {
                                                                            user_id: idPengguna,
                                                                            access_token: generateAccessToken,
                                                                            platform: 'web'
                                                                        }
                                                                    );

                                                                    inputan.save(function (err) {
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
                                        two: function (callback) {
                                            return res.json({
                                                success: true,
                                                data: {
                                                    access_token: generateAccessToken,
                                                    id_pengguna: idPengguna,
                                                    username: username,
                                                    peran: peran
                                                }
                                            })

                                            callback(null, 2);
                                        }
                                    }, function (err, results) {
                                        // results is now equal to: {one: 1, two: 2}
                                    })

                                } else if (results.length == 0) {//Akun tidak ditemukan
                                    return res.json({
                                        success: false,
                                        data: {message: 'Maaf email atau username atau sandi anda salah.'}
                                    })
                                }
                            }
                        })


                } else {
                    return res.json({success: false})
                }


            }

        });

}

exports.masuk_android = function (req, res) {

    //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email atau Username').notEmpty();
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
        {email: req.body.email, sandi: req.body.sandi}
    );

    User.find({'email': inputan.email, 'sandi': md5(inputan.sandi + salt_password)})
        .exec(function (err, results) {

            if (err) {
                return res.json({success: false, data: err})
            } else {

                if (results.length == 1) {//Akun ditemukan

                    var dataPengguna = {data: results}
                    var username = dataPengguna.data[0].profil.username
                    var peran = dataPengguna.data[0].peran
                    var idPengguna = dataPengguna.data[0]._id

                    var generateAccessToken = randomAccessToken()

                    //Mengatur kembalian
                    async.series({
                        one: function (callback) {
                            //Mencek apakah sudah ada access token untuk pengguna yang masuk
                            Session.find({'user_id': idPengguna, 'end_at': null, 'platform': 'android'})
                                .exec(function (err, results) {
                                    var dataSession

                                    if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                        // Buat baru access token di collection session
                                        var inputan = new Session(
                                            {
                                                user_id: idPengguna,
                                                access_token: generateAccessToken,
                                                platform: 'android'
                                            }
                                        );

                                        inputan.save(function (err) {
                                            if (err) {
                                                //return res.json({success: false, data: err})
                                            } else {
                                                //accessToken = generateAccessToken
                                            }
                                        })

                                    } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                        // Meng ekspire kan access token
                                        var dataSession = {data: results}
                                        //console.log("Pjg Kembalian: "+results.length)
                                        var idSession = dataSession.data[0]._id

                                        Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                            .exec(function (err, results) {
                                                if (err) {

                                                } else {
                                                    // Buat baru access token di collection session
                                                    var inputan = new Session(
                                                        {
                                                            user_id: idPengguna,
                                                            access_token: generateAccessToken,
                                                            platform: 'android'
                                                        }
                                                    );

                                                    inputan.save(function (err) {
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
                        two: function (callback) {
                            return res.json({
                                success: true,
                                data: {
                                    access_token: generateAccessToken,
                                    id_pengguna: idPengguna,
                                    username: username,
                                    peran: peran
                                }
                            })

                            callback(null, 2);
                        }
                    }, function (err, results) {
                        // results is now equal to: {one: 1, two: 2}
                    })


                } else if (results.length == 0) {//Akun tidak ditemukan


                    //Jalankan fungsi login dengan username
                    User.find({'profil.username': inputan.email, 'sandi': md5(inputan.sandi + salt_password)})
                        .exec(function (err, results) {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {
                                if (results.length == 1) {//Akun ditemukan

                                    var dataPengguna = {data: results}
                                    var username = dataPengguna.data[0].profil.username
                                    var peran = dataPengguna.data[0].peran
                                    var idPengguna = dataPengguna.data[0]._id

                                    var generateAccessToken = randomAccessToken()

                                    //Mengatur kembalian
                                    async.series({
                                        one: function (callback) {
                                            //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                            Session.find({'user_id': idPengguna, 'end_at': null, 'platform': 'android'})
                                                .exec(function (err, results) {
                                                    var dataSession

                                                    if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                                        // Buat baru access token di collection session
                                                        var inputan = new Session(
                                                            {
                                                                user_id: idPengguna,
                                                                access_token: generateAccessToken,
                                                                platform: 'android'
                                                            }
                                                        );

                                                        inputan.save(function (err) {
                                                            if (err) {
                                                                //return res.json({success: false, data: err})
                                                            } else {
                                                                //accessToken = generateAccessToken
                                                            }
                                                        })

                                                    } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                                        // Meng ekspire kan access token
                                                        var dataSession = {data: results}
                                                        //console.log("Pjg Kembalian: "+results.length)
                                                        var idSession = dataSession.data[0]._id

                                                        Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                                            .exec(function (err, results) {
                                                                if (err) {

                                                                } else {
                                                                    // Buat baru access token di collection session
                                                                    var inputan = new Session(
                                                                        {
                                                                            user_id: idPengguna,
                                                                            access_token: generateAccessToken,
                                                                            platform: 'android'
                                                                        }
                                                                    );

                                                                    inputan.save(function (err) {
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
                                        two: function (callback) {
                                            return res.json({
                                                success: true,
                                                data: {
                                                    access_token: generateAccessToken,
                                                    id_pengguna: idPengguna,
                                                    username: username,
                                                    peran: peran
                                                }
                                            })

                                            callback(null, 2);
                                        }
                                    }, function (err, results) {
                                        // results is now equal to: {one: 1, two: 2}
                                    })

                                } else if (results.length == 0) {//Akun tidak ditemukan
                                    return res.json({
                                        success: false,
                                        data: {message: 'Maaf email atau username atau sandi anda salah.'}
                                    })
                                }
                            }
                        })


                } else {
                    return res.json({success: false})
                }


            }

        });

}

exports.atur_ulang_sandi = function (req, res) {

    //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email').notEmpty();


    //Dibersihkan dari Special Character
    req.sanitize('email').escape();
    req.sanitize('email').trim();


    //Menjalankan validasi
    var errors = req.validationErrors();

    //Membuat objek inputan sudah di validasi dan dibersihkan
    var inputan = new User(
        {email: req.body.email}
    );


    User.find({'email': inputan.email})
        .exec(function (err, results) {

            if (err) {
                return res.json({success: false, data: err})
            } else {

                if (results.length == 1) {//Akun dengan parameter email ditemukan

                    var sandiMurni = randomPasswordMurni()
                    var sandiSalt = md5(sandiMurni + salt_password)

                    User.update(
                        {email: inputan.email},
                        {$set: {sandi: sandiSalt}}
                    ).exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {

                            //Proses kirim email
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'no.reply.tadj@gmail.com',
                                    pass: '321851re141'
                                }
                            });

                            console.log("Sandi murni: " + sandiMurni)

                            var mailOptions = {
                                from: 'no.reply.tadj@gmail.com',
                                to: inputan.email,
                                subject: 'Vidyanusa: Permohonan reset sandi',
                                text: "Sandi akun Vidyanusa anda sekarang: " + sandiMurni
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log("Terjadi kesalah ketika mengirim ke email: " + error);
                                    return res.redirect('/atur_ulang_sandi')
                                } else {
                                    //console.log('Email sent: ' + info.response);
                                    return res.redirect('/atur_ulang_sandi')
                                }
                            });

                            return res.json({
                                success: true,
                                data: {message: 'Sandi yang sudah diatur kembali sudah dikirim ke email yang Anda tuliskan.'}
                            })
                        }
                    })

                } else {
                    return res.json({
                        success: true,
                        data: {message: "Email yang Anda tuliskan tidak ditemukan dalam database."}
                    })
                }
            }
        })
}

exports.daftar_proses_siswa = function (req, res) {

    //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email').notEmpty();//
    req.checkBody('username', 'Mohon isi field Username').notEmpty();//
    req.checkBody('nama_lengkap', 'Mohon isi field Nama Lengkap').notEmpty();//
    req.checkBody('jenis_kelamin', 'Mohon pilih Jenis Kelamin').notEmpty();//
    req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();//
    //req.checkBody('kode_kelas', 'Mohon isi field kode kelas').notEmpty();//

    //Dibersihkan dari Special Character
    req.sanitize('email').escape();
    req.sanitize('username').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('jenis_kelamin').escape();
    req.sanitize('sandi').escape();
    //req.sanitize('kode_kelas').escape();

    req.sanitize('email').trim();
    req.sanitize('username').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('jenis_kelamin').trim();
    req.sanitize('sandi').trim();
    //req.sanitize('kode_kelas').trim();

    //Menjalankan validasi
    var errors = req.validationErrors();

    //Eksekusi validasi
    if (errors) {//Terjadinya kesalahan

        return res.json({success: false, data: errors})

    } else {//Input ke collection

        //Dicek terlebih dahulu apakah email atau password sudah terdaftar
        UserSiswa.find({$or: [{'email': req.body.email}, {'profil.username': req.body.username}]})
            .exec(function (err, results) {

                if (err) {
                    return res.json({success: false, data: err})
                } else {

                    if (results.length == 1) {//Email atau username sudah terdaftar
                        return res.json({success: false, data: [{message: 'Email atau username sudah terdaftar'}]})
                    } else if (results.length == 0) {//Email atau username bisa digunakan

                        var dataKelas = {data: results}

                        //Membuat objek inputan sudah di validasi dan dibersihkan
                        var inputan = new UserSiswa(
                            {
                                email: req.body.email,
                                sandi: md5(req.body.sandi + salt_password),
                                peran: 3,
                                profil: {
                                    username: req.body.username,
                                    nama_lengkap: req.body.nama_lengkap,
                                    jenis_kelamin: req.body.jenis_kelamin,
                                }
                            }
                        );

                        //Query simpan ke collection pengguna
                        inputan.save(function (err) {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {

                                //Menggunakan kembali fungsi login
                                UserSiswa.find({'email': req.body.email, 'sandi': md5(req.body.sandi + salt_password)})
                                    .exec(function (err, results) {

                                        if (err) {
                                            return res.json({success: false, data: err})
                                        } else {

                                            if (results.length == 1) {//Akun ditemukan
                                                var dataPengguna = {data: results}
                                                var username = dataPengguna.data[0].profil.username
                                                var peran = dataPengguna.data[0].peran
                                                var idPengguna = dataPengguna.data[0]._id

                                                var generateAccessToken = randomAccessToken()

                                                //Mengatur kembalian
                                                async.series({
                                                    one: function (callback) {
                                                        //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                                        Session.find({'user_id': idPengguna, 'end_at': null})
                                                            .exec(function (err, results) {
                                                                var dataSession

                                                                if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                                                    // Buat baru access token di collection session
                                                                    var inputan = new Session(
                                                                        {
                                                                            user_id: idPengguna,
                                                                            access_token: generateAccessToken,
                                                                            platform: 'web'
                                                                        }
                                                                    );

                                                                    inputan.save(function (err) {
                                                                        if (err) {
                                                                            //return res.json({success: false, data: err})
                                                                        } else {
                                                                            //accessToken = generateAccessToken
                                                                        }
                                                                    })

                                                                } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                                                    // Meng ekspire kan access token
                                                                    var dataSession = {data: results}
                                                                    //console.log("Pjg Kembalian: "+results.length)
                                                                    var idSession = dataSession.data[0]._id

                                                                    Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                                                        .exec(function (err, results) {
                                                                            if (err) {

                                                                            } else {
                                                                                // Buat baru access token di collection session
                                                                                var inputan = new Session(
                                                                                    {
                                                                                        user_id: idPengguna,
                                                                                        access_token: generateAccessToken,
                                                                                        platform: 'web'
                                                                                    }
                                                                                );

                                                                                inputan.save(function (err) {
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
                                                    two: function (callback) {
                                                        return res.json({
                                                            success: true,
                                                            data: {
                                                                access_token: generateAccessToken,
                                                                id_pengguna: idPengguna,
                                                                username: username,
                                                                peran: peran
                                                            }
                                                        })

                                                        callback(null, 2);
                                                    }
                                                }, function (err, results) {
                                                    // results is now equal to: {one: 1, two: 2}
                                                })


                                            } else if (results.length == 0) {//Akun tidak ditemukan
                                                return res.json({
                                                    success: false,
                                                    data: {message: 'Maaf email atau sandi anda salah.'}
                                                })
                                            } else {
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

exports.daftar_proses_siswa_android = function (req, res) {

    //Inisial validasi
    req.checkBody('email', 'Mohon isi field Email').notEmpty();//
    req.checkBody('username', 'Mohon isi field Username').notEmpty();//
    req.checkBody('nama_lengkap', 'Mohon isi field Nama Lengkap').notEmpty();//
    req.checkBody('jenis_kelamin', 'Mohon pilih Jenis Kelamin').notEmpty();//
    req.checkBody('sandi', 'Mohon isi field Sandi').notEmpty();//
    //req.checkBody('kode_kelas', 'Mohon isi field kode kelas').notEmpty();//

    //Dibersihkan dari Special Character
    req.sanitize('email').escape();
    req.sanitize('username').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('jenis_kelamin').escape();
    req.sanitize('sandi').escape();
    //req.sanitize('kode_kelas').escape();

    req.sanitize('email').trim();
    req.sanitize('username').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('jenis_kelamin').trim();
    req.sanitize('sandi').trim();
    //req.sanitize('kode_kelas').trim();

    //Menjalankan validasi
    var errors = req.validationErrors();

    //Eksekusi validasi
    if (errors) {//Terjadinya kesalahan

        return res.json({success: false, data: errors})

    } else {//Input ke collection

        //Dicek terlebih dahulu apakah email atau password sudah terdaftar
        UserSiswa.find({$or: [{'email': req.body.email}, {'profil.username': req.body.username}]})
            .exec(function (err, results) {

                if (err) {
                    return res.json({success: false, data: err})
                } else {

                    if (results.length == 1) {//Email atau username sudah terdaftar
                        return res.json({success: false, data: [{message: 'Email atau username sudah terdaftar'}]})
                    } else if (results.length == 0) {//Email atau username bisa digunakan

                        var dataKelas = {data: results}

                        //Membuat objek inputan sudah di validasi dan dibersihkan
                        var inputan = new UserSiswa(
                            {
                                email: req.body.email,
                                sandi: md5(req.body.sandi + salt_password),
                                peran: 3,
                                profil: {
                                    username: req.body.username,
                                    nama_lengkap: req.body.nama_lengkap,
                                    jenis_kelamin: req.body.jenis_kelamin,
                                }
                            }
                        );

                        //Query simpan ke collection pengguna
                        inputan.save(function (err) {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {

                                //Menggunakan kembali fungsi login
                                UserSiswa.find({'email': req.body.email, 'sandi': md5(req.body.sandi + salt_password)})
                                    .exec(function (err, results) {

                                        if (err) {
                                            return res.json({success: false, data: err})
                                        } else {

                                            if (results.length == 1) {//Akun ditemukan
                                                var dataPengguna = {data: results}
                                                var username = dataPengguna.data[0].profil.username
                                                var peran = dataPengguna.data[0].peran
                                                var idPengguna = dataPengguna.data[0]._id

                                                var generateAccessToken = randomAccessToken()

                                                //Mengatur kembalian
                                                async.series({
                                                    one: function (callback) {
                                                        //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                                        Session.find({'user_id': idPengguna, 'end_at': null})
                                                            .exec(function (err, results) {
                                                                var dataSession

                                                                if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                                                    // Buat baru access token di collection session
                                                                    var inputan = new Session(
                                                                        {
                                                                            user_id: idPengguna,
                                                                            access_token: generateAccessToken,
                                                                            platform: 'web'
                                                                        }
                                                                    );

                                                                    inputan.save(function (err) {
                                                                        if (err) {
                                                                            //return res.json({success: false, data: err})
                                                                        } else {
                                                                            //accessToken = generateAccessToken
                                                                        }
                                                                    })

                                                                } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                                                    // Meng ekspire kan access token
                                                                    var dataSession = {data: results}
                                                                    //console.log("Pjg Kembalian: "+results.length)
                                                                    var idSession = dataSession.data[0]._id

                                                                    Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                                                        .exec(function (err, results) {
                                                                            if (err) {

                                                                            } else {
                                                                                // Buat baru access token di collection session
                                                                                var inputan = new Session(
                                                                                    {
                                                                                        user_id: idPengguna,
                                                                                        access_token: generateAccessToken,
                                                                                        platform: 'android'
                                                                                    }
                                                                                );

                                                                                inputan.save(function (err) {
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
                                                    two: function (callback) {
                                                        return res.json({
                                                            success: true,
                                                            data: {
                                                                access_token: generateAccessToken,
                                                                id_pengguna: idPengguna,
                                                                username: username,
                                                                peran: peran
                                                            }
                                                        })

                                                        callback(null, 2);
                                                    }
                                                }, function (err, results) {
                                                    // results is now equal to: {one: 1, two: 2}
                                                })


                                            } else if (results.length == 0) {//Akun tidak ditemukan
                                                return res.json({
                                                    success: false,
                                                    data: {message: 'Maaf email atau sandi anda salah.'}
                                                })
                                            } else {
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

exports.daftar_proses_guru = function (req, res) {

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
            sandi: md5(req.body.sandi + salt_password),
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
    if (errors) {//Terjadinya kesalahan

        return res.json({success: false, data: errors})

    } else {//Input ke collection

        //Dicek terlebih dahulu apakah email atau username sudah terdaftar
        //User.find({'email':req.body.email,'username':md5(inputan.sandi+salt_password)})
        User.find({$or: [{'email': req.body.email}, {'profil.username': req.body.username}]})
            .exec(function (err, results) {

                if (err) {
                    return res.json({success: false, data: err})
                } else {

                    if (results.length == 1) {//Email atau username sudah terdaftar
                        return res.json({success: false, data: [{message: 'Email atau username sudah terdaftar'}]})
                    } else if (results.length == 0) {//Email atau username bisa digunakan
                        //Query simpan ke collection pengguna
                        inputan.save(function (err) {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {

                                //Menggunakan kembali fungsi login
                                User.find({'email': req.body.email, 'sandi': md5(req.body.sandi + salt_password)})
                                    .exec(function (err, results) {

                                        if (err) {
                                            return res.json({success: false, data: err})
                                        } else {

                                            if (results.length == 1) {//Akun ditemukan
                                                var dataPengguna = {data: results}
                                                var username = dataPengguna.data[0].profil.username
                                                var peran = dataPengguna.data[0].peran
                                                var idPengguna = dataPengguna.data[0]._id

                                                var generateAccessToken = randomAccessToken()

                                                //Mengatur kembalian
                                                async.series({
                                                    one: function (callback) {
                                                        //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                                        Session.find({'user_id': idPengguna, 'end_at': null})
                                                            .exec(function (err, results) {
                                                                var dataSession

                                                                if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                                                    // Buat baru access token di collection session
                                                                    var inputan = new Session(
                                                                        {
                                                                            user_id: idPengguna,
                                                                            access_token: generateAccessToken,
                                                                            platform: 'web'
                                                                        }
                                                                    );

                                                                    inputan.save(function (err) {
                                                                        if (err) {
                                                                            //return res.json({success: false, data: err})
                                                                        } else {
                                                                            //accessToken = generateAccessToken
                                                                        }
                                                                    })

                                                                } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                                                    // Meng ekspire kan access token
                                                                    var dataSession = {data: results}
                                                                    //console.log("Pjg Kembalian: "+results.length)
                                                                    var idSession = dataSession.data[0]._id

                                                                    Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                                                        .exec(function (err, results) {
                                                                            if (err) {

                                                                            } else {
                                                                                // Buat baru access token di collection session
                                                                                var inputan = new Session(
                                                                                    {
                                                                                        user_id: idPengguna,
                                                                                        access_token: generateAccessToken,
                                                                                        platform: 'web'
                                                                                    }
                                                                                );

                                                                                inputan.save(function (err) {
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
                                                    two: function (callback) {
                                                        return res.json({
                                                            success: true,
                                                            data: {
                                                                access_token: generateAccessToken,
                                                                id_pengguna: idPengguna,
                                                                username: username,
                                                                peran: peran
                                                            }
                                                        })

                                                        callback(null, 2);
                                                    }
                                                }, function (err, results) {
                                                    // results is now equal to: {one: 1, two: 2}
                                                })


                                            } else if (results.length == 0) {//Akun tidak ditemukan
                                                return res.json({
                                                    success: false,
                                                    data: {message: 'Maaf email atau sandi anda salah.'}
                                                })
                                            } else {
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

exports.daftar_proses_guru_android = function (req, res) {

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
            sandi: md5(req.body.sandi + salt_password),
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
    if (errors) {//Terjadinya kesalahan

        return res.json({success: false, data: errors})

    } else {//Input ke collection

        //Dicek terlebih dahulu apakah email atau password sudah terdaftar
        //User.find({'email':req.body.email,'username':md5(inputan.sandi+salt_password)})
        User.find({$or: [{'email': req.body.email}, {'profil.username': req.body.username}]})
            .exec(function (err, results) {

                if (err) {
                    return res.json({success: false, data: err})
                } else {

                    if (results.length == 1) {//Email atau username sudah terdaftar
                        return res.json({success: false, data: [{message: 'Email atau username sudah terdaftar'}]})
                    } else if (results.length == 0) {//Email atau username bisa digunakan
                        //Query simpan ke collection pengguna
                        inputan.save(function (err) {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {

                                //Menggunakan kembali fungsi login
                                User.find({'email': req.body.email, 'sandi': md5(req.body.sandi + salt_password)})
                                    .exec(function (err, results) {

                                        if (err) {
                                            return res.json({success: false, data: err})
                                        } else {

                                            if (results.length == 1) {//Akun ditemukan
                                                var dataPengguna = {data: results}
                                                var username = dataPengguna.data[0].profil.username
                                                var peran = dataPengguna.data[0].peran
                                                var idPengguna = dataPengguna.data[0]._id

                                                var generateAccessToken = randomAccessToken()

                                                //Mengatur kembalian
                                                async.series({
                                                    one: function (callback) {
                                                        //Mencek apakah sudah ada access token untuk pengguna yang masuk
                                                        Session.find({'user_id': idPengguna, 'end_at': null})
                                                            .exec(function (err, results) {
                                                                var dataSession

                                                                if (results.length == 0) {//Pengguna belum memiliki session dengan end date null
                                                                    // Buat baru access token di collection session
                                                                    var inputan = new Session(
                                                                        {
                                                                            user_id: idPengguna,
                                                                            access_token: generateAccessToken,
                                                                            platform: 'android'
                                                                        }
                                                                    );

                                                                    inputan.save(function (err) {
                                                                        if (err) {
                                                                            //return res.json({success: false, data: err})
                                                                        } else {
                                                                            //accessToken = generateAccessToken
                                                                        }
                                                                    })

                                                                } else if (results.length == 1) {//Pengguna sudah memiliki session dengan end date null
                                                                    // Meng ekspire kan access token
                                                                    var dataSession = {data: results}
                                                                    //console.log("Pjg Kembalian: "+results.length)
                                                                    var idSession = dataSession.data[0]._id

                                                                    Session.update({_id: idSession}, {$set: {end_at: Date.now()}})
                                                                        .exec(function (err, results) {
                                                                            if (err) {

                                                                            } else {
                                                                                // Buat baru access token di collection session
                                                                                var inputan = new Session(
                                                                                    {
                                                                                        user_id: idPengguna,
                                                                                        access_token: generateAccessToken,
                                                                                        platform: 'android'
                                                                                    }
                                                                                );

                                                                                inputan.save(function (err) {
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
                                                    two: function (callback) {
                                                        return res.json({
                                                            success: true,
                                                            data: {
                                                                access_token: generateAccessToken,
                                                                id_pengguna: idPengguna,
                                                                username: username,
                                                                peran: peran
                                                            }
                                                        })

                                                        callback(null, 2);
                                                    }
                                                }, function (err, results) {
                                                    // results is now equal to: {one: 1, two: 2}
                                                })


                                            } else if (results.length == 0) {//Akun tidak ditemukan
                                                return res.json({
                                                    success: false,
                                                    data: {message: 'Maaf email atau sandi anda salah.'}
                                                })
                                            } else {
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
// akses token
exports.get_profile = function (req, res, next) {

    if (req.body.username == '' || req.body.username == null) {
        return res.json({success: false, data: {message: 'Username tidak boleh kosong'}})
    } else {

        User.find({'profil.username': req.body.username})//inputan.username
            .exec(function (err, results) {
                var expire = false
                //Mengatur alur REST
                async.series({
                    one: function (callback) {

                        setTimeout(function () {
                            //Mencek apakah access token yang dimiliki pengguna masih berlaku
                            Session.find({'access_token': req.body.access_token, 'end_at': null})
                                .exec(function (err, results) {


                                    if (results.length == 0) {//Sudah expired akses tokennya
                                        expire = true;
                                        console.log('Status expire jadi:' + expire)
                                    }

                                });
                            callback(null, 1);
                        }, 1000);


                    },
                    two: function (callback) {

                        setTimeout(function () {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {
                                console.log('Status expire jadinya:' + expire)
                                if (expire == true) {
                                    return res.json({
                                        success: false,
                                        data: {message: 'Akses token sudah expired atau tidak ditemukan'}
                                    })
                                } else if (expire == false) {
                                    if (results.length == 0) {
                                        return res.json({
                                            success: false,
                                            data: {message: 'Data profil tidak ditemukan'}
                                        })
                                    } else {
                                        return res.json({success: true, data: results, expire: expire})
                                    }
                                }
                            }
                            callback(null, 2);
                        }, 1000);

                    }
                }, function (err, results) {

                })

            });

    }

}

exports.get_profile_siswa = function (req, res, next) {

    if (req.body.username == '' || req.body.username == null) {
        return res.json({success: false, data: {message: 'Username atau akses token tidak boleh kosong'}})
    } else {

        UserSiswa.find({'profil.username': req.body.username})//inputan.username
            .populate('kelas', 'nama_kelas')
            .exec(function (err, results) {
                var expire = false
                //Mengatur alur REST
                async.series({
                    one: function (callback) {

                        setTimeout(function () {
                            //Mencek apakah access token yang dimiliki pengguna masih berlaku
                            Session.find({'access_token': req.body.access_token, 'end_at': null})
                                .exec(function (err, results) {


                                    if (results.length == 0) {//Sudah expired akses tokennya
                                        expire = true;
                                        console.log('Status expire jadi:' + expire)
                                    }

                                });
                            callback(null, 1);
                        }, 1000);


                    },
                    two: function (callback) {

                        setTimeout(function () {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {
                                console.log('Status expire jadinya:' + expire)
                                if (expire == true) {
                                    return res.json({
                                        success: false,
                                        data: {message: 'Akses token sudah expired atau tidak ditemukan'}
                                    })
                                } else if (expire == false) {
                                    if (results.length == 0) {
                                        return res.json({
                                            success: false,
                                            data: {message: 'Data profil tidak ditemukan'}
                                        })
                                    } else {
                                        return res.json({success: true, data: results, expire: expire})
                                    }
                                }
                            }
                            callback(null, 2);
                        }, 1000);

                    }
                }, function (err, results) {

                })

            });

    }

}

exports.get_profile_guru = function (req, res, next) {

    if (req.body.username == '' || req.body.username == null) {
        return res.json({success: false, data: {message: 'Username atau akses token tidak boleh kosong'}})
    } else {

        User.find({'profil.username': req.body.username})//inputan.username
            .exec(function (err, results) {
                var expire = false
                //Mengatur alur REST
                async.series({
                    one: function (callback) {

                        setTimeout(function () {
                            //Mencek apakah access token yang dimiliki pengguna masih berlaku
                            Session.find({'access_token': req.body.access_token, 'end_at': null})
                                .exec(function (err, results) {


                                    if (results.length == 0) {//Sudah expired akses tokennya
                                        expire = true;
                                        console.log('Status expire jadi:' + expire)
                                    }

                                });
                            callback(null, 1);
                        }, 1000);


                    },
                    two: function (callback) {

                        setTimeout(function () {
                            if (err) {
                                return res.json({success: false, data: err})
                            } else {
                                console.log('Status expire jadinya:' + expire)
                                if (expire == true) {
                                    return res.json({
                                        success: false,
                                        data: {message: 'Akses token sudah expired atau tidak ditemukan'}
                                    })
                                } else if (expire == false) {
                                    if (results.length == 0) {
                                        return res.json({
                                            success: false,
                                            data: {message: 'Data profil tidak ditemukan'}
                                        })
                                    } else {
                                        return res.json({success: true, data: results, expire: expire})
                                    }
                                }
                            }
                            callback(null, 2);
                        }, 1000);

                    }
                }, function (err, results) {

                })

            });

    }

}

exports.keluar = function (req, res) {
    if (req.body.access_token == null) {
        return res.json({success: false, message: 'Parameter akses token tidak boleh kosong'})
    } else {
        Session.update({access_token: req.body.access_token}, {$set: {end_at: Date.now()}})
            .exec(function (err, results) {
                if (err) {
                    return res.json({success: false})
                } else {
                    return res.json({success: true})
                }
            })
    }


}

exports.tambah_poin = function (req, res) {
    args = {
        data: {
            access_token: req.body.access_token
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };

    //Cek session terlebih dahulu sebelum menambahkan poin
    rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {

        if (data.success == true) {//session berlaku

            //Inisial validasi
            req.checkBody('id_pengguna', 'Id pengguna tidak boleh kosong').notEmpty();
            req.checkBody('jumlah_poin', 'Jumlah poin tidak boleh kosong').notEmpty();
            req.checkBody('keterangan', 'keterangan tidak boleh kosong').notEmpty();

            //Dibersihkan dari Special Character
            req.sanitize('id_pengguna').escape();
            req.sanitize('jumlah_poin').escape();
            req.sanitize('keterangan').escape();

            req.sanitize('id_pengguna').trim();
            req.sanitize('jumlah_poin').trim();
            req.sanitize('keterangan').trim();

            //Menjalankan validasi
            var errors = req.validationErrors();

            if (errors) {//Terjadinya kesalahan
                return res.json({success: false, data: errors})
            } else {

                var inputan = new Poin(
                    {
                        id_pengguna: req.body.id_pengguna,
                        jumlah_poin: req.body.jumlah_poin,
                        keterangan: req.body.keterangan
                    }
                );

                inputan.save(function (err) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Poin berhasil ditambahkan.'}})
                    }
                })

            }


        } else {//session tidak berlaku
            //console.log('Session Tidak Berlaku:'+JSON.stringify())
            return res.json({success: false, data: {message: 'Token tidak berlaku'}})

        }

    });

}

exports.daftar_poin = function (req, res) {

    if (req.body.id_pengguna == null || req.body.id_pengguna == '') {
        return res.json({success: false, data: {message: 'Param id pengguna tidak boleh kosong.'}})
    } else {

        Poin.find({'id_pengguna': req.body.id_pengguna})
            .sort([['created_at', 'descending']])
            .exec(function (err, results) {
                return res.json({success: true, data: results})
            })

    }

}

exports.cek_session = function (req, res) {

    Session.find({'access_token': req.body.access_token, 'end_at': null})
        .exec(function (err, results) {

            if (results.length == 0) {//Sudah expired akses tokennya
                return res.json({success: false, data: {message: 'Token tidak ditemukan atau sudah tidak berlaku.'}})
            } else if (results.length == 1) {
                return res.json({success: true, data: {message: 'Token berlaku.'}})
            }

        });

}

exports.ambil_email = function (req, res) {
    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Penggun tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('pengguna').trim();

    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {
        Session.find({'access_token': req.body.access_token, 'end_at': null})
            .exec(function (err, results) {

                if (results.length == 0) {//Cek token terdaftar atau tidak
                    return res.json({
                        success: false,
                        data: {message: 'Token tidak ditemukan atau sudah tidak berlaku.'}
                    })
                } else if (results.length == 1) {

                    //Mengambil email berdasarkan id pengguna
                    UserSiswa.find({'_id': req.body.pengguna})
                        .select({'email': 1})
                        .exec(function (err, results) {
                            return res.json({success: true, data: results})
                        })

                }

            });
    }


}

exports.pemilik_token = function (req, res) {
    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();

    req.sanitize('access_token').trim();

    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {
        Session.find({'access_token': req.body.access_token, 'end_at': null})
            .exec(function (err, results) {

                if (results.length == 0) {//Cek token terdaftar atau tidak
                    return res.json({
                        success: false,
                        data: {message: 'Token tidak ditemukan atau sudah tidak berlaku.'}
                    })
                } else if (results.length == 1) {

                    //Menguraikan data session dan penggunanya
                    Session.find({'access_token': req.body.access_token, 'end_at': null})
                        .populate('user_id')
                        .select({'user_id': 1})
                        .exec(function (err, results) {
                            return res.json({success: true, data: results})
                        })

                }

            });
    }


}

exports.siswa_kelas_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('kode_kelas', 'Kode kelas tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('kode_kelas').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('kode_kelas').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mencari kelas berdasarkan kodenya
                Class.find({kode: req.body.kode_kelas}).exec(function (err, results) {

                    var count = results.length
                    if (count > 0) {
                        var idKelasKembalian = results[0]._id
                        //Mencek apakah siswa sudah terdaftar dikelas yang akan ditambahkan
                        UserSiswa.find({_id: req.body.pengguna, kelas: idKelasKembalian}).exec(function (err, results) {

                            var count = results.length
                            if (count > 0) {//Siswa sudah memiliki kelas yang dituju
                                return res.json({
                                    success: false,
                                    data: {message: 'Gagal menambahkan kelas. Anda sudah terdaftar di kelas yang anda tuju.'}
                                })
                            } else {
                                UserSiswa.update(
                                    {_id: req.body.pengguna},
                                    {$push: {kelas: idKelasKembalian}}
                                ).exec(function (err, results) {
                                    if (err) {
                                        return res.json({success: false, data: {message: err}})
                                    } else {
                                        return res.json({success: true, data: {message: 'Kelas berhasil ditambahkan'}})
                                    }
                                })
                            }
                        })

                    } else if (count == 0) {
                        return res.json({
                            success: false,
                            data: {message: 'Gagal menambahkan menambahkan kelas, kelas tidak ditemukan.'}
                        })
                    }

                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_prestasi_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('prestasi', 'Prestasi tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('prestasi').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('prestasi').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan prestasi
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {prestasi: req.body.prestasi}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Berhasil menambahkan prestasi.'}})
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_pengalaman_organisasi_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('pengalaman_organisasi', 'Pengalaman organisasi tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('pengalaman_organisasi').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('pengalaman_organisasi').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan pengalaman organisasi
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {pengalaman_organisasi: req.body.pengalaman_organisasi}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Berhasil menambahkan pengalaman organisasi.'}})
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_minat_bakat_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('minat_bakat', 'Minat bakat tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('minat_bakat').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('minat_bakat').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan minat bakat
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {minat_bakat: req.body.minat_bakat}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Berhasil menambahkan minat bakat.'}})
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_sertifikat_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('sertifikat', 'Sertifikat tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('sertifikat').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('sertifikat').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan sertifikat
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {sertifikat: req.body.sertifikat}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Berhasil menambahkan sertifikat.'}})
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_hobi_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('hobi', 'Hobi tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('hobi').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('hobi').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan hobi
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {hobi: req.body.hobi}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Berhasil menambahkan hobi.'}})
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_karya_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('karya', 'Karya tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('karya').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('karya').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan karya
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {karya: req.body.karya}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({success: true, data: {message: 'Berhasil menambahkan karya.'}})
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_bahasa_yang_dikuasai_tambah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('bahasa_yang_dikuasai', 'Bahasa yang anda kuasai tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('bahasa_yang_dikuasai').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('bahasa_yang_dikuasai').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Menambahkan hobi
                UserSiswa.update(
                    {_id: req.body.pengguna},
                    {$push: {bahasa_yang_dikuasai: req.body.bahasa_yang_dikuasai}}
                ).exec(function (err, results) {
                    if (err) {
                        return res.json({success: false, data: {message: err}})
                    } else {
                        return res.json({
                            success: true,
                            data: {message: 'Bahasa yang anda kuasai berhasil ditambahkan.'}
                        })
                    }
                })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_profil_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('nama_lengkap', 'Nama lengkap tidak boleh kosong').notEmpty();
    req.checkBody('bio', 'Bio tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('bio').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('bio').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mengubah data nama lengkap dan bio
                UserSiswa.update({_id: req.body.pengguna}, {
                    $set: {
                        'profil.nama_lengkap': req.body.nama_lengkap,
                        'profil.bio': req.body.bio
                    }
                })
                    .exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {
                            return res.json({success: true, data: {message: 'Data profil berhasil diperbaharui.'}})
                        }
                    })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_email_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();
    req.checkBody('email', 'Email tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('pengguna').escape();
    req.sanitize('email').escape();

    req.sanitize('access_token').trim();
    req.sanitize('pengguna').trim();
    req.sanitize('email').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mencek terlebih dahulu apakah email sudah digunakan?
                UserSiswa.find({'email': req.body.email})
                    .exec(function (err, results) {
                        if (results.length == 1) {//Email sudah digunakan
                            return res.json({success: false, data: {message: 'Email sudah digunakan'}})
                        } else if (results.length == 0) {

                            //Mengubah email
                            UserSiswa.update({_id: req.body.pengguna}, {$set: {'email': req.body.email}})
                                .exec(function (err, results) {
                                    if (err) {
                                        return res.json({success: false, data: {message: err}})
                                    } else {
                                        return res.json({
                                            success: true,
                                            data: {message: 'Email berhasil diperbaharui.'}
                                        })
                                    }
                                })

                        }
                    });


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_medsos_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();
    req.checkBody('facebook', 'Akun facebook tidak boleh kosong').notEmpty();
    req.checkBody('instagram', 'Akun instagram tidak boleh kosong').notEmpty();
    req.checkBody('twitter', 'Akun twitter tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('pengguna').escape();
    req.sanitize('facebook').escape();
    req.sanitize('instagram').escape();
    req.sanitize('twitter').escape();

    req.sanitize('access_token').trim();
    req.sanitize('pengguna').escape();
    req.sanitize('facebook').trim();
    req.sanitize('instagram').trim();
    req.sanitize('twitter').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mengubah data nama lengkap dan bio
                UserSiswa.update({_id: req.body.pengguna}, {
                    $set: {
                        'media_sosial.facebook': req.body.facebook,
                        'media_sosial.instagram': req.body.instagram,
                        'media_sosial.twitter': req.body.twitter
                    }
                })
                    .exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {
                            return res.json({
                                success: true,
                                data: {message: 'Data media sosial anda berhasil diperbaharui.'}
                            })
                        }
                    })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_profil_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('nama_lengkap', 'Nama lengkap tidak boleh kosong').notEmpty();
    req.checkBody('bio', 'Bio tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('bio').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('bio').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mengubah data nama lengkap dan bio
                UserSiswa.update({_id: req.body.pengguna}, {
                    $set: {
                        'profil.nama_lengkap': req.body.nama_lengkap,
                        'profil.bio': req.body.bio
                    }
                })
                    .exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {
                            return res.json({success: true, data: {message: 'Data profil berhasil diperbaharui.'}})
                        }
                    })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.guru_profil_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('nama_lengkap', 'Nama lengkap tidak boleh kosong').notEmpty();
    req.checkBody('bio', 'Bio tidak boleh kosong').notEmpty();
    req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();
    req.sanitize('nama_lengkap').escape();
    req.sanitize('bio').escape();
    req.sanitize('pengguna').escape();

    req.sanitize('access_token').trim();
    req.sanitize('nama_lengkap').trim();
    req.sanitize('bio').trim();
    req.sanitize('pengguna').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mengubah data nama lengkap dan bio
                User.update({_id: req.body.pengguna}, {
                    $set: {
                        'profil.nama_lengkap': req.body.nama_lengkap,
                        'profil.bio': req.body.bio
                    }
                })
                    .exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {
                            return res.json({success: true, data: {message: 'Data profil berhasil diperbaharui.'}})
                        }
                    })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.siswa_foto_profil_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('alamat_url_foto', 'Alamat url foto tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();

    req.sanitize('access_token').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mengubah data nama lengkap dan bio
                UserSiswa.update({_id: req.body.pengguna}, {$set: {'profil.foto': req.body.alamat_url_foto}})
                    .exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {
                            return res.json({success: true, data: {message: 'Foto profil berhasil diperbaharui.'}})
                        }
                    })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.guru_foto_profil_ubah = function (req, res) {

    req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
    req.checkBody('alamat_url_foto', 'Alamat url foto tidak boleh kosong').notEmpty();

    req.sanitize('access_token').escape();

    req.sanitize('access_token').trim();


    var errors = req.validationErrors();

    if (errors) {//Terjadinya kesalahan
        return res.json({success: false, data: errors})
    } else {

        args = {
            data: {
                access_token: req.body.access_token
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        rClient.post(base_api_general_url + '/cek_session', args, function (data, response) {
            if (data.success == true) {//session berlaku

                //Mengubah data nama lengkap dan bio
                User.update({_id: req.body.pengguna}, {$set: {'profil.foto': req.body.alamat_url_foto}})
                    .exec(function (err, results) {
                        if (err) {
                            return res.json({success: false, data: {message: err}})
                        } else {
                            return res.json({success: true, data: {message: 'Foto profil berhasil diperbaharui.'}})
                        }
                    })


            } else {//session tidak berlaku
                return res.json({success: false, data: {message: 'Token tidak berlaku'}})
            }
        })

    }

}

exports.get_profile_porto = function (req, res, next) {

    if (req.body.username == '' || req.body.username == null) {
        return res.json({success: false, data: {message: 'Username tidak boleh kosong'}})
    } else {

        User.find({'profil.username': req.body.username})//inputan.username
            .exec(function (err, results) {
                if (results.length == 0) {
                    return res.json({success: false, data: {message: 'Data profil tidak ditemukan'}})
                } else {
                    return res.json({success: true, data: results})
                }
            });

    }

}
