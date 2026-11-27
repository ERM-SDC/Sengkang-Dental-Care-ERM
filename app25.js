async function cetakKuitansi() {
  if (!ksInv) return;
  if (!ksV) return;
  $('ksMsg').textContent = '';
  var a = await sb.from('invoice_items').select('deskripsi,qty,harga').eq('invoice_id', ksInv.id).is('deleted_at', null);
  var b = await sb.from('payments').select('jumlah,metode,dibayar_pada').eq('invoice_id', ksInv.id).is('deleted_at', null).order('dibayar_pada', { ascending: true });
  var s = await sb.from('settings').select('kunci,nilai');
  var st = {};
  (s.data ? s.data : []).forEach(function (x) { st[x.kunci] = x.nilai; });
  var pays = b.data ? b.data : [];
  if (!pays.length) {
    $('ksMsg').className = 'err';
    $('ksMsg').textContent = 'Belum ada pembayaran untuk dicetak.';
    return;
  }
  cetakHtml(htmlKuitansi(st, a.data ? a.data : [], pays));
}
