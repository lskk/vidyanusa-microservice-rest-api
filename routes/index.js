var express = require('express');
var router = express.Router();
var app = express();

/* GET home page. */
router.get('/daftar_sekolah', function(req, res, next) {
  res.render('index')
});

module.exports = router;
