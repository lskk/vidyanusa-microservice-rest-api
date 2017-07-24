var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var userController = require('../controllers/userController');
var mapelController = require('../controllers/mapelController');

router.get('/daftar_sekolah', function(req, res, next) {
  res.redirect('/public/daftar_sekolah');
});

router.get('/daftar_kegiatan', function(req, res, next) {

});

router.post('/profil', userController.get_profile)

router.post('/masuk', userController.masuk);


router.group("/android", (router) => {
    router.post('/masuk', userController.masuk_android);
    router.post("/daftar/proses/guru", userController.daftar_proses_guru_android);
    router.post("/daftar/proses/siswa", userController.daftar_proses_siswa_android);
});

router.post('/keluar', userController.keluar);

router.post('/cek_session', userController.cek_session);

router.group("/poin", (router) => {
    router.post("/tambah", userController.tambah_poin);
});

router.group("/daftar/proses", (router) => {
    router.post("/guru", userController.daftar_proses_guru);
    router.post("/siswa", userController.daftar_proses_siswa);
});

router.group("/mapel", (router) => {
    router.get("/", mapelController.daftar_mapel);
    router.post("/materi", mapelController.daftar_materi);
});

router.group("/kirim", (router) => {
    router.post("/status", function(req, res, next) {

    });
});

module.exports = router;
