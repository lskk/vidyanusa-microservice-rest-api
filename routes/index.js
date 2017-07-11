var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var userController = require('../controllers/userController');

router.get('/daftar_sekolah', function(req, res, next) {
  res.redirect('/public/daftar_sekolah');
});

router.get('/daftar_kegiatan', function(req, res, next) {

});

router.post('/profil', userController.get_profile)

router.post('/masuk', userController.masuk);

router.post('/keluar', userController.keluar);

router.group("/daftar/proses", (router) => {
    router.post("/guru", userController.daftar_proses_guru);
});

router.group("/kirim", (router) => {
    router.post("/status", function(req, res, next) {

    });
});

module.exports = router;
