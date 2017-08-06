var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var userController = require('../controllers/userController');
var mapelController = require('../controllers/mapelController');
var publicController = require('../controllers/publicController');



router.group("/daftar_sekolah", (router) => {
  router.get('/', function(req, res, next) {
    res.redirect('/public/daftar_sekolah');
  });
  router.post('/pengguna', publicController.daftar_sekolah_pengguna);

})

router.group("/pengguna", (router) => {
  router.post('/guru/sekolah', publicController.pengguna_guru_sekolah);
})

router.group("/daftar_kelas", (router) => {
    router.post('/', publicController.daftar_kelas);
    router.post('/guru', publicController.daftar_kelas_guru);
    router.post('/tambah', publicController.tambah_kelas);
    router.post('/detail', publicController.kelas_detail);
    router.post('/ubah_nama', publicController.kelas_detail_ubah_nama);
    router.post('/ubah_mapel', publicController.kelas_detail_ubah_mapel);
    router.post('/ubah_guru', publicController.kelas_detail_ubah_guru);
})

router.group("/pengaturan", (router) => {
    router.post('/siswa/kelas/tambah', userController.siswa_kelas_tambah);
    router.post('/siswa/prestasi/tambah', userController.siswa_prestasi_tambah);
    router.post('/siswa/profil/ubah', userController.siswa_profil_ubah);
})


router.get('/daftar_kegiatan', function(req, res, next) {

});

router.post('/profil', userController.get_profile)
router.post('/profil/siswa', userController.get_profile_siswa)

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
    router.post("/daftar", userController.daftar_poin);
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
