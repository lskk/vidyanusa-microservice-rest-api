//Import model
var Sekolah = require('../models/schoolModel');
var async = require('async');


exports.daftar_sekolah = function(req,res,next) {

  Sekolah.find()
   .sort([['nama_sekolah', 'ascending']])
   .exec(function (err, schools) {
     if (err) { return next(err); }

     res.json({success: true, data: schools})

   });

}
