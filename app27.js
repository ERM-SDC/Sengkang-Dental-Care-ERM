var tdKw = 'padding:3px 6px;border-bottom:1px solid #999';

function tabelKw(items, pays, dis, total, bayar) {
  var h = '<table style="width:100%;border-collapse:collapse;margin-top:14px"><tr><td style="' + tdKw + ';font-weight:700">Rincian biaya</td>' +
    '<td style="' + tdKw + ';text-align:right;font-weight:700">Jumlah</td></tr>';
  items.forEach(function (x) {
    h += '<tr><td style="' + tdKw + '">' + esc(x.deskripsi) + '</td><td style="' + tdKw + ';text-align:right">' + rp(Number(x.harga) * Number(x.qty)) + '</td></tr>';
  });
  h += '<tr><td style="' + tdKw + '">Diskon</td><td style="' + tdKw + ';text-align:right">' + rp(dis) + '</td></tr>' +
    '<tr><td style="' + tdKw + ';font-weight:700">Total tagihan</td><td style="' + tdKw + ';text-align:right;font-weight:700">' + rp(total) + '</td></tr></table>' +
    '<table style="width:100%;border-collapse:collapse;margin-top:14px"><tr><td style="' + tdKw + ';font-weight:700">Pembayaran</td>' +
    '<td style="' + tdKw + ';font-weight:700">Metode</td><td style="' + tdKw + ';text-align:right;font-weight:700">Jumlah</td></tr>';
  pays.forEach(function (x) {
    h += '<tr><td style="' + tdKw + '">' + fmtWaktu(x.dibayar_pada) + '</td><td style="' + tdKw + '">' + esc(x.metode) +
      '</td><td style="' + tdKw + ';text-align:right">' + rp(x.jumlah) + '</td></tr>';
  });
  return h + '<tr><td style="' + tdKw + ';font-weight:700" colspan="2">Total dibayar</td><td style="' + tdKw +
    ';text-align:right;font-weight:700">' + rp(bayar) + '</td></tr></table>';
}

function footerKw(sisa) {
  return '<div style="margin-top:10px;font-weight:700">' + (sisa > 0 ? 'Sisa tagihan: ' + rp(sisa) : 'LUNAS') + '</div>' +
    '<div style="margin-top:28px;text-align:right">Petugas,<br><br><br>' + esc($('uNama').textContent) +
    '<br><small>Dicetak ' + fmtTgl(tglKey(new Date())) + '</small></div>';
}
