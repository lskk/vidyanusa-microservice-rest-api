//Import model
var Mapel = require('../models/mapelModel');
var Session = require('../models/sessionModel');


//Import library
var async = require('async');
var moment = require('moment');


exports.daftar_mapel = function(req,res) {

  Mapel.find({}).select({nama_mapel:1})
   .exec(function (err, results) {

     if (err) {
       return res.json({success: false, data: err})
     }else{
       return res.json({success: true, data: results})
     }

   });

}

exports.daftar_materi = function(req,res) {
  var idMapel = req.body.id_mapel

  Mapel.find({'_id':idMapel}).select({materi:1})
   .populate('materi')
   .exec(function (err, results) {

     if (err) {
       return res.json({success: false, data: err})
     }else{
       if(idMapel == null){
         return res.json({success: false, data: {message: 'Id mata pelajaran tidak boleh kosong'}})
       }else if(results.length == 1){
         return res.json({success: true, data: results})
       }
     }

   });

}
