async function muatKunjungan() {
  var r = await sb.from('visits')
    .select('id,no_kunjungan,jam_datang,jenis,status,keluhan_utama,patients(no_rm,nama),doctors(nama)')
    .eq('tanggal', hariIni()).is('deleted_at', null).order('jam_datang', { ascending: true });
  if (r.error) { $('kDaftar').innerHTML = '<div class="err">Gagal memuat: ' + esc(r.error.message) + '</div>'; return; }
  var data = r.data ? r.data : [];
  if (!data.length) { $('kDaftar').innerHTML = '<small style="color:var(--mut)">Belum ada kunjungan hari ini.</small>'; return; }
  var h = '';
  data.forEach(function (k) {
    var p = k.patients ? k.patients : {};
    var dk = k.doctors ? k.doctors.nama : '';
    h += '<div class="row"><span class="rm">' + esc(k.no_kunjungan) + '</span> <strong>' + esc(p.nama) + '</strong> <span class="st">' + esc(k.status) + '</span><br>' +
      '<small>' + esc(String(k.jam_datang).slice(0, 5)) + ' - ' + esc(k.jenis) + ' - ' + esc(p.no_rm) +
      (k.keluhan_utama ? ' - ' + esc(k.keluhan_utama) : '') + (dk ? '<br>' + esc(dk) : '') + '</small></div>';
  });
  $('kDaftar').innerHTML = h;
}

$('nav').addEventListener('click', function (e) { var t = e.target.dataset.tab; if (t) tab(t); });
var kTmr;
$('kq').addEventListener('input', function () { clearTimeout(kTmr); kTmr = setTimeout(cariPasienK, 300); });
$('kHasil').addEventListener('click', function (e) { var r = e.target.closest('.row'); if (r) pilihPasien(Number(r.dataset.i)); });
$('kSimpan').onclick = simpanKunjungan;
$('kBatal').onclick = resetForm;
