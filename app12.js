var ksData = [];
var ksV = null;
var ksInv = null;
var ksAsli = [];
var ksBayar = 0;
var lpP = 'hari';
var lpRows = [];
var lpRange = {};
VIEW.kasir = 'vKasir';
VIEW.laporan = 'vLaporan';

var tabAsli = tab;
tab = function (nama) {
  tabAsli(nama);
  if (nama === 'kasir') { tutupKs(); muatKasir(); }
  if (nama === 'laporan') muatLaporan();
};

function tglKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function fmtTgl(s) { var a = String(s).split('-'); return a[2] + '/' + a[1] + '/' + a[0]; }
function fmtWaktu(s) {
  var d = new Date(s);
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}
function stInv(total, bayar) { return bayar <= 0 ? 'UNPAID' : (bayar >= total ? 'PAID' : 'PARTIALLY_PAID'); }

function hitungKs(v) {
  var inv = v.invoices && v.invoices.length ? v.invoices[0] : null;
  var sub = 0, bayar = 0, dis = 0;
  if (inv) {
    (inv.invoice_items ? inv.invoice_items : []).forEach(function (t) { if (!t.deleted_at) sub += Number(t.harga) * Number(t.qty); });
    (inv.payments ? inv.payments : []).forEach(function (p) { if (!p.deleted_at) bayar += Number(p.jumlah); });
    dis = Number(inv.diskon);
  } else {
    (v.visit_procedures ? v.visit_procedures : []).forEach(function (t) { if (!t.deleted_at) sub += Number(t.tarif) * Number(t.qty); });
  }
  var total = sub - dis;
  var st = bayar <= 0 ? 'Belum dibayar' : (bayar >= total ? 'Lunas' : 'Sebagian');
  return { sub: sub, dis: dis, total: total, bayar: bayar, sisa: total - bayar, st: st };
}
