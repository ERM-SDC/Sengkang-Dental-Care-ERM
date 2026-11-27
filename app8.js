var rVisit = null;
var rAsli = [];
var rData = [];
var VIEW = { pasien: 'vPasien', daftar: 'vDaftar', rekam: 'vRekam' };
var RF = [
  ['subjective', 'S - Subjective', [['keluhan', 'Keluhan utama'], ['riwayat', 'Riwayat penyakit sekarang']]],
  ['objective', 'O - Objective', [['ekstra', 'Pemeriksaan ekstraoral'], ['intra', 'Pemeriksaan intraoral'], ['penunjang', 'Pemeriksaan penunjang']]],
  ['assessment', 'A - Assessment', [['dx', 'Diagnosis utama'], ['dx2', 'Diagnosis tambahan'], ['icd', 'ICD-10 (jika ada)']]],
  ['plan', 'P - Plan', [['rencana', 'Rencana perawatan'], ['edukasi', 'Edukasi'], ['kontrol', 'Kontrol']]]
];
var TIND2 = ['Konsultasi', 'Pemeriksaan', 'Scaling', 'Polishing', 'Tambal sementara', 'Tambal komposit', 'GIC',
  'Pencabutan gigi', 'Odontektomi', 'Insisi drainase', 'Perawatan saluran akar', 'Mahkota', 'Prostodontik',
  'Tindakan bedah mulut', 'Radiografi', 'Laboratorium'];

function tab(nama) {
  Object.keys(VIEW).forEach(function (n) { $(VIEW[n]).classList.toggle('hide', n !== nama); });
  $('nav').querySelectorAll('span').forEach(function (x) { x.classList.toggle('on', x.dataset.tab === nama); });
  if (nama === 'daftar') { muatDokter(); muatKunjungan(); }
  if (nama === 'rekam') { tutupRekam(); muatAntrean(); }
}

var rh = '<div class="card"><h2>Antrean pemeriksaan</h2><div id="rList"></div></div>' +
  '<div id="rForm" class="card hide"><div class="tot" id="rHead"></div>' +
  '<small id="rInfo" style="color:var(--mut)"></small><div id="rMedis" style="margin-top:6px"></div>';
RF.forEach(function (g) {
  rh += '<h2 style="margin-top:16px">' + g[1] + '</h2>';
  g[2].forEach(function (f) {
    rh += '<label for="r_' + f[0] + '">' + f[1] + '</label><textarea id="r_' + f[0] + '" rows="2"></textarea>';
  });
});
rh += '<h2 style="margin-top:16px">Tindakan dan biaya</h2><div id="rTind"></div>' +
  '<div style="margin-top:8px"><button type="button" class="alt" id="rTambah">+ Tambah tindakan</button></div>' +
  '<div class="tot" id="rTotal">Total: Rp0</div>' +
  '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button id="rSimpan">Simpan</button>' +
  '<button id="rSelesai">Simpan dan selesai</button><button class="alt" id="rTutup">Tutup</button></div>' +
  '<div id="rMsg"></div><datalist id="dlT2"></datalist></div>';
$('vRekam').innerHTML = rh;
var dl2 = '';
TIND2.forEach(function (t) { dl2 += '<option value="' + t + '">'; });
$('dlT2').innerHTML = dl2;
