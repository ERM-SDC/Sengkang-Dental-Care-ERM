async function muatLaporan() {
  var now = new Date();
  var h0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var w0 = new Date(h0.getFullYear(), h0.getMonth(), h0.getDate() - ((h0.getDay() + 6) % 7));
  var m0 = new Date(now.getFullYear(), now.getMonth(), 1);
  var mulai = w0 < m0 ? w0 : m0;
  var r = await sb.from('payments').select('jumlah,metode,dibayar_pada')
    .gte('dibayar_pada', mulai.toISOString()).is('deleted_at', null).limit(2000);
  if (r.error) { $('lpKartu').innerHTML = '<div class="err">Gagal memuat: ' + esc(r.error.message) + '</div>'; return; }
  lpRows = (r.data ? r.data : []).map(function (p) { return { j: Number(p.jumlah), m: p.metode, d: new Date(p.dibayar_pada) }; });
  lpRange = { hari: h0, minggu: w0, bulan: m0 };
  tampilLp();
}

function tampilLp() {
  var info = [['hari', 'Hari ini'], ['minggu', 'Minggu ini'], ['bulan', 'Bulan ini']];
  var h = '';
  info.forEach(function (x) {
    var t = 0, n = 0;
    lpRows.forEach(function (y) { if (y.d >= lpRange[x[0]]) { t += y.j; n++; } });
    h += '<div class="lpk' + (lpP === x[0] ? ' on' : '') + '" data-p="' + x[0] + '">' + x[1] + '<b>' + rp(t) + '</b><small>' + n + ' transaksi</small></div>';
  });
  $('lpKartu').innerHTML = h;
  var mt = {}, hr = {};
  lpRows.forEach(function (y) {
    if (y.d < lpRange[lpP]) return;
    mt[y.m] = (mt[y.m] ? mt[y.m] : 0) + y.j;
    var k = tglKey(y.d);
    hr[k] = (hr[k] ? hr[k] : 0) + y.j;
  });
  var nm = { hari: 'Hari ini', minggu: 'Minggu ini (Senin sampai hari ini)', bulan: 'Bulan ini (tanggal 1 sampai hari ini)' };
  $('lpJudul').textContent = 'Rincian - ' + nm[lpP];
  var o = '<strong>Per metode pembayaran</strong>';
  Object.keys(mt).forEach(function (k) { o += '<div class="row" style="cursor:default">' + esc(k) + ': ' + rp(mt[k]) + '</div>'; });
  if (lpP !== 'hari') {
    o += '<div style="margin-top:12px"><strong>Per hari</strong></div>';
    Object.keys(hr).sort().reverse().forEach(function (k) { o += '<div class="row" style="cursor:default">' + fmtTgl(k) + ': ' + rp(hr[k]) + '</div>'; });
  }
  $('lpRinci').innerHTML = Object.keys(mt).length ? o : '<small style="color:var(--mut)">Belum ada pembayaran pada periode ini.</small>';
}
