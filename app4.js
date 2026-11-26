var kPasienId = null;
var kHasilData = [];

function pad(n) { return n < 10 ? '0' + n : String(n); }
function hariIni() {
  var d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function rp(n) { return 'Rp' + Number(n).toLocaleString('id-ID'); }

$('vDaftar').innerHTML =
  '<div class="card"><h2>Pendaftaran kunjungan</h2>' +
  '<label for="kq">Cari pasien (nama atau nomor RM)</label>' +
  '<input id="kq" placeholder="Ketik minimal 2 huruf"><div id="kHasil"></div>' +
  '<div id="kForm" class="hide"><div class="tot" id="kPasien"></div>' +
  '<div class="grid"><div><label for="kDokter">Dokter</label><select id="kDokter"></select></div>' +
  '<div><label for="kJenis">Jenis kunjungan</label><select id="kJenis"><option>Baru</option><option>Kontrol</option>' +
  '<option>Emergency</option><option>Konsultasi</option><option>Tindakan</option></select></div></div>' +
  '<label for="kKeluhan">Keluhan utama</label><input id="kKeluhan">' +
  '<div style="margin-top:12px;display:flex;gap:8px"><button id="kSimpan">Daftarkan</button>' +
  '<button class="alt" id="kBatal">Batal</button></div><div id="kMsg"></div></div></div>' +
  '<div class="card"><h2>Kunjungan hari ini</h2><div id="kDaftar"></div></div>';

function tab(nama) {
  $('vPasien').classList.toggle('hide', nama !== 'pasien');
  $('vDaftar').classList.toggle('hide', nama !== 'daftar');
  $('nav').querySelectorAll('span').forEach(function (x) {
    x.classList.toggle('on', x.dataset.tab === nama);
  });
  if (nama === 'daftar') { muatDokter(); muatKunjungan(); }
}

var tampilAsli = tampil;
tampil = function (app) {
  tampilAsli(app);
  if (app) tab('pasien');
};

async function muatDokter() {
  var r = await sb.from('doctors').select('id,nama').eq('aktif', true).is('deleted_at', null).order('urutan', { ascending: true });
  var list = r.data ? r.data : [];
  var h = '';
  list.forEach(function (u) { h += '<option value="' + esc(u.id) + '">' + esc(u.nama) + '</option>'; });
  $('kDokter').innerHTML = h;
}
