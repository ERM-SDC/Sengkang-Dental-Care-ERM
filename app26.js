function baris(l, v) {
  return '<tr><td style="width:150px;vertical-align:top">' + l + '</td><td>: ' + v + '</td></tr>';
}

function htmlKuitansi(st, items, pays) {
  var sub = 0, bayar = 0;
  items.forEach(function (x) { sub += Number(x.harga) * Number(x.qty); });
  pays.forEach(function (x) { bayar += Number(x.jumlah); });
  var dis = Number(ksInv.diskon);
  var total = sub - dis;
  var p = ksV.patients ? ksV.patients : {};
  var dk = ksV.doctors ? ksV.doctors.nama : '';
  var h = '<div style="font:14px/1.5 Georgia,serif;color:#000;max-width:680px;margin:0 auto">' +
    '<div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px"><div style="font-size:20px;font-weight:700">' +
    esc(st.nama_klinik ? st.nama_klinik : 'Sengkang Dental Care') + '</div>' +
    (st.alamat ? '<div>' + esc(st.alamat) + '</div>' : '') + (st.telepon ? '<div>Telp. ' + esc(st.telepon) + '</div>' : '') + '</div>' +
    '<div style="text-align:center;font-size:18px;font-weight:700;margin-top:14px">KUITANSI</div>' +
    '<div style="text-align:center;margin-bottom:14px">No. KW-' + esc(ksV.no_kunjungan) + '</div>' +
    '<table style="width:100%;border-collapse:collapse">' +
    baris('Telah terima dari', esc(p.nama) + ' (' + esc(p.no_rm) + ')') +
    baris('Uang sejumlah', '<em>' + esc(huruf(bayar)) + '</em>') +
    baris('Untuk pembayaran', 'Perawatan gigi tanggal ' + fmtTgl(ksV.tanggal) + (dk ? ', ' + esc(dk) : '')) + '</table>';
  h += tabelKw(items, pays, dis, total, bayar);
  h += footerKw(total - bayar);
  return h + '</div>';
}
