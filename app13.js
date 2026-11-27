$('vKasir').innerHTML =
  '<div class="card"><h2>Kasir</h2><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
  '<select id="ksFilter" style="width:auto"><option value="belum">Belum lunas</option><option value="semua">Semua</option></select>' +
  '<span class="tot" id="ksPiutang" style="margin:0"></span></div><div id="ksList" style="margin-top:10px"></div></div>' +
  '<div id="ksForm" class="card hide"><div class="tot" id="ksHead"></div><small id="ksInfo" style="color:var(--mut)"></small>' +
  '<h2 style="margin-top:14px">Rincian biaya</h2><div id="ksItems"></div>' +
  '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="alt" id="ksTambah">+ Tambah biaya</button>' +
  '<button type="button" class="alt" id="ksSync">Muat ulang dari rekam medis</button></div>' +
  '<label for="ksDiskon">Diskon (Rp)</label><input id="ksDiskon" type="number" min="0" inputmode="numeric">' +
  '<div class="tot" id="ksRingkas"></div>' +
  '<h2 style="margin-top:14px">Pembayaran</h2><div class="grid">' +
  '<div><label for="ksJumlah">Jumlah dibayar (Rp)</label><input id="ksJumlah" type="number" min="0" inputmode="numeric"></div>' +
  '<div><label for="ksMetode">Metode</label><select id="ksMetode"><option>Cash</option><option>Transfer</option><option>QRIS</option>' +
  '<option>Debit</option><option>Kredit</option><option>Lainnya</option></select></div></div>' +
  '<div id="ksTunai"><label for="ksTerima">Uang diterima (tunai)</label><input id="ksTerima" type="number" min="0" inputmode="numeric"></div>' +
  '<div class="tot" id="ksKembali"></div>' +
  '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button id="ksBayar">Catat pembayaran</button>' +
  '<button class="alt" id="ksSimpan">Simpan tagihan</button><button class="alt" id="ksTutup">Tutup</button></div><div id="ksMsg"></div>' +
  '<h2 style="margin-top:14px">Riwayat pembayaran</h2><div id="ksRiwayat"></div></div>';
$('vLaporan').innerHTML =
  '<div class="card"><h2>Pendapatan</h2><div id="lpKartu" style="display:flex;gap:8px;flex-wrap:wrap"></div></div>' +
  '<div class="card"><h2 id="lpJudul"></h2><div id="lpRinci"></div></div>';
