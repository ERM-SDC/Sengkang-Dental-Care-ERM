async function muatKunjungan() {
  var r = await sb.from('visits')
    .select('id,no_kunjungan,jam_datang,jenis,status,keluhan_utama,patients(no_rm,nama),doctors(nama),visit_procedures(tarif,qty,deleted_at)')
    .eq('tanggal', hariIni()).is('deleted_at', null).order('jam_datang', { ascending: true });
  if (r.error) { $('kDaftar').innerHTML = '<div class="err">Gagal memuat: ' + esc(r.error.message) + '</div>'; return; }
  var data = r.data ? r.data : [];
  if (!data.length) { $('kDaftar').innerHTML = '<small style="color:var(--mut)">Belum ada kunjungan hari ini.</small>'; return; }
  var h = '';
  data.forEach(function (k) {
    var tot = 0;
    (k.visit_procedures ? k.visit_procedures : []).forEach(function (t) { if (!t.deleted_at) tot += Number(t.tarif) * Number(t.qty); });
    var p = k.patients ? k.patients : {};
    var dk = k.doctors ? k.doctors.nama : '';
    h += '<div class="row"><span class="rm">' + esc(k.no_kunjungan) + '</span> <strong>' + esc(p.nama) + '</strong> <span class="st">' + esc(k.status) + '</span><br>' +
      '<small>' + esc(String(k.jam_datang).slice(0, 5)) + ' - ' + esc(k.jenis) + ' - ' + esc(p.no_rm) + ' - ' + rp(tot) +
      (k.keluhan_utama ? ' - ' + esc(k.keluhan_utama) : '') + (dk ? '<br>' + esc(dk) : '') + '</small></div>';
  });
  $('kDaftar').innerHTML = h;
}

var TIND = ['Konsultasi', 'Pemeriksaan', 'Scaling', 'Polishing', 'Tambal sementara', 'Tambal komposit', 'GIC',
  'Pencabutan gigi', 'Odontektomi', 'Insisi drainase', 'Perawatan saluran akar', 'Mahkota', 'Prostodontik',
  'Tindakan bedah mulut', 'Radiografi', 'Laboratorium'];
var dl = '';
TIND.forEach(function (t) { dl += '<option value="' + t + '">'; });
$('dlTind').innerHTML = dl;

$('nav').addEventListener('click', function (e) { var t = e.target.dataset.tab; if (t) tab(t); });
var kTmr;
$('kq').addEventListener('input', function () { clearTimeout(kTmr); kTmr = setTimeout(cariPasienK, 300); });
$('kHasil').addEventListener('click', function (e) { var r = e.target.closest('.row'); if (r) pilihPasien(Number(r.dataset.i)); });
$('kTambah').onclick = tambahRow;
$('kRows').addEventListener('input', hitungTotal);
$('kRows').addEventListener('click', function (e) {
  if (e.target.classList.contains('th')) { e.target.parentNode.remove(); hitungTotal(); }
});
$('kSimpan').onclick = simpanKunjungan;
$('kBatal').onclick = resetForm;
