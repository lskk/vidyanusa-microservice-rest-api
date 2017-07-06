var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var publicController = require('../controllers/publicController');

router.get('/daftar_sekolah', publicController.daftar_sekolah)

router.group("/kirim", (router) => {
  
    router.post("/status", function(req, res, next) {

    });

});

module.exports = router;
