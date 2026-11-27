async function simpanTagihan() {
  var now = new Date().toISOString();
  var rows = Array.from($('ksItems').querySelectorAll('.trow'));
  var ada = {};
  for (var i = 0; i < rows.length; i++) {
    var nama = rows[i].querySelector('.tn').value.trim();
    var harga = Number(rows[i].querySelector('.tb').value);
    var rid = rows[i].dataset.id;
    if (!nama) continue;
    var q;
    if (rid) {
      ada[rid] = true;
      q = await sb.from('invoice_items').update({ deskripsi: nama, qty: 1, harga: harga, updated_at: now }).eq('id', rid);
    } else {
      q = await sb.from('invoice_items').insert({ invoice_id: ksInv.id, deskripsi: nama, qty: 1, harga: harga });
    }
    if (q.error) throw new Error(q.error.message);
  }
  for (var j = 0; j < ksAsli.length; j++) {
    if (!ada[ksAsli[j]]) await sb.from('invoice_items').update({ deleted_at: now }).eq('id', ksAsli[j]);
  }
  var dis = Number($('ksDiskon').value);
  var u = await sb.from('invoices').update({ diskon: dis, updated_at: now }).eq('id', ksInv.id);
  if (u.error) throw new Error(u.error.message);
  ksInv.diskon = dis;
}

async function totalServer() {
  var a = await sb.from('invoice_items').select('harga,qty').eq('invoice_id', ksInv.id).is('deleted_at', null);
  var b = await sb.from('payments').select('jumlah').eq('invoice_id', ksInv.id).is('deleted_at', null);
  var sub = 0, bayar = 0;
  (a.data ? a.data : []).forEach(function (x) { sub += Number(x.harga) * Number(x.qty); });
  (b.data ? b.data : []).forEach(function (x) { bayar += Number(x.jumlah); });
  return { total: sub - Number(ksInv.diskon), bayar: bayar };
}
