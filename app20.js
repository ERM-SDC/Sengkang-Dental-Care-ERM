var rwData = [];
var rwPid = null;
VIEW.riwayat = 'vRiwayat';

$('vRiwayat').innerHTML =
  '<div class="card"><button class="alt" id="rwKembali">Kembali ke daftar pasien</button>' +
  '<div class="tot" id="rwHead"></div><small id="rwInfo" style="color:var(--mut)"></small>' +
  '<div id="rwMedis" style="margin-top:6px"></div>' +
  '<div style="margin-top:10px"><button class="alt" id="rwIdent">Lihat identitas lengkap</button></div></div>' +
  '<div class="card"><h2>Riwayat kunjungan</h2><div id="rwList"></div></div>';

var detailLama = detail;
detail = function (id) { bukaRiwayat(id); };
$('rwIdent').onclick = function () { if (rwPid) detailLama(rwPid); };
$('rwKembali').onclick = function () { tab('pasien'); };
