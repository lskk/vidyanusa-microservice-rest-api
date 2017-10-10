var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var userController = require('../controllers/userController');
var mapelController = require('../controllers/mapelController');
var publicController = require('../controllers/publicController');
var logController = require('../controllers/logController');


router.group("/daftar_sekolah", (router) => {
  router.get('/', function(req, res, next) {
    res.redirect('/public/daftar_sekolah');
  });
  router.post('/pengguna', publicController.daftar_sekolah_pengguna);

})

router.group("/pengguna", (router) => {
  router.post('/siswa/sekolah', publicController.pengguna_siswa_sekolah);
  router.post('/guru/sekolah', publicController.pengguna_guru_sekolah);
})

router.group("/daftar_kelas", (router) => {
    router.post('/', publicController.daftar_kelas);
    router.post('/siswa', publicController.daftar_kelas_siswa);
    router.post('/guru', publicController.daftar_kelas_guru);
    router.post('/tambah', publicController.tambah_kelas);
    router.post('/detail', publicController.kelas_detail);
    router.post('/ubah_nama', publicController.kelas_detail_ubah_nama);
    router.post('/ubah_mapel', publicController.kelas_detail_ubah_mapel);
    router.post('/ubah_guru', publicController.kelas_detail_ubah_guru);
    router.post('/ubah_siswa', publicController.kelas_detail_ubah_siswa);
})

router.group("/pengaturan", (router) => {
    router.post('/siswa/kelas/tambah', userController.siswa_kelas_tambah);
    router.post('/siswa/prestasi/tambah', userController.siswa_prestasi_tambah);
    //router.post('/siswa/profil/ubah', userController.siswa_profil_ubah); HAPUS KALAU SUDAH BENAR FUNGSI UBAH PROFIL
    router.post('/siswa/foto_profil/ubah', userController.siswa_foto_profil_ubah);
    router.post('/siswa/pengalaman_organisasi/tambah', userController.siswa_pengalaman_organisasi_tambah);
    router.post('/siswa/minat_bakat/tambah', userController.siswa_minat_bakat_tambah);
    router.post('/siswa/sertifikat/tambah', userController.siswa_sertifikat_tambah);
    router.post('/siswa/hobi/tambah', userController.siswa_hobi_tambah);
    router.post('/siswa/bahasa_yang_dikuasai/tambah', userController.siswa_bahasa_yang_dikuasai_tambah);
    router.post('/siswa/karya/tambah', userController.siswa_karya_tambah);
    router.post('/siswa/profil/ubah', userController.siswa_profil_ubah);
    router.post('/siswa/email/ubah', userController.siswa_email_ubah);
    router.post('/siswa/medsos/ubah', userController.siswa_medsos_ubah);
    router.post('/guru/profil/ubah', userController.guru_profil_ubah);
    router.post('/guru/foto_profil/ubah', userController.guru_foto_profil_ubah);

})


router.get('/daftar_kegiatan', function(req, res, next) {

});

router.post('/profil', userController.get_profile)
router.post('/profil/siswa', userController.get_profile_siswa)
router.post('/profil/guru', userController.get_profile_guru)

router.post('/masuk', userController.masuk);
router.group("/daftar/proses", (router) => {
    router.post("/guru", userController.daftar_proses_guru);
    router.post("/siswa", userController.daftar_proses_siswa);
});

router.group("/android", (router) => {
    router.post('/masuk', userController.masuk_android);
    router.post("/daftar/proses/guru", userController.daftar_proses_guru_android);
    router.post("/daftar/proses/siswa", userController.daftar_proses_siswa_android);
});

router.post('/atur_ulang_sandi', userController.atur_ulang_sandi);

router.post('/keluar', userController.keluar);

router.post('/cek_session', userController.cek_session);

router.post('/pemilik_token', userController.pemilik_token);

router.post('/ambil_email', userController.ambil_email);

router.group("/poin", (router) => {
    router.post("/tambah", userController.tambah_poin);
    router.post("/daftar", userController.daftar_poin);
});



router.group("/mapel", (router) => {
    router.get("/", mapelController.daftar_mapel);
    router.post("/materi", mapelController.daftar_materi);
});

router.group("/kirim", (router) => {
    router.post("/status", function(req, res, next) {

    });
});

router.group("/log", (router) => {
    router.get("/", logController.daftar_logs);         //lihat daftar semua log
    router.post("/tambah", logController.post_log);     //menambah log
    router.post("/user", logController.daftar_log_user);    //lihat daftar log by user
    router.post("/id", logController.daftar_log_id);    //lihat daftar log by user
});


router.post('/profil_porto', userController.get_profile_porto)

module.exports = router;
