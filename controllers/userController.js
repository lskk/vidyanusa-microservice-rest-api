//Import model
var Sekolah = require('../models/schoolModel');
var async = require('async');


exports.daftar_guru = function(req,res) {
  res.json({success: true, data: req.body.email})
}
