var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

router.get('/daftar_sekolah', function(req, res, next) {

});

router.get('/daftar_kegiatan', function(req, res, next) {

});

router.get('/profil/:userId', function(req, res) {

})

router.post('/masuk', function(req, res, next) {

});

router.post('/daftar_guru', function(req, res, next) {

});

router.group("/kirim", (router) => {

    router.post("/status", function(req, res, next) {


    });

});

module.exports = router;
