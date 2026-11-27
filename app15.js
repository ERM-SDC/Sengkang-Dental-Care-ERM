function barisKs(p) {
  var d = document.createElement('div');
  d.className = 'trow';
  d.innerHTML = '<input class="tn" list="dlT2" placeholder="Uraian biaya">' +
    '<input class="tb" type="number" min="0" inputmode="numeric" placeholder="Rp">' +
    '<button type="button" class="alt th">Hapus</button>';
  if (p) {
    d.dataset.id = p.id;
    d.querySelector('.tn').value = p.deskripsi;
    d.querySelector('.tb').value = Number(p.harga) * Number(p.qty);
  }
  $('ksItems').appendChild(d);
}

function ringkasKs() {
  var sub = 0;
  $('ksItems').querySelectorAll('.tb').forEach(function (x) { sub += Number(x.value); });
  var dis = Number($('ksDiskon').value);
  var total = sub - dis;
  $('ksRingkas').innerHTML = 'Subtotal: ' + rp(sub) + '<br>Diskon: ' + rp(dis) + '<br>Total: ' + rp(total) +
    '<br>Sudah dibayar: ' + rp(ksBayar) + '<br>Sisa: ' + rp(total - ksBayar);
  var tunai = $('ksMetode').value === 'Cash';
  $('ksTunai').classList.toggle('hide', !tunai);
  var terima = Number($('ksTerima').value);
  var kb = terima - Number($('ksJumlah').value);
  $('ksKembali').textContent = (tunai && terima > 0 && kb >= 0) ? 'Kembalian: ' + rp(kb) : '';
  return total - ksBayar;
}

async function renderTagihan() {
  var a = await sb.from('invoice_items').select('id,deskripsi,qty,harga').eq('invoice_id', ksInv.id).is('deleted_at', null);
  var b = await sb.from('payments').select('jumlah,metode,dibayar_pada').eq('invoice_id', ksInv.id).is('deleted_at', null).order('dibayar_pada', { ascending: true });
  var items = a.data ? a.data : [];
  ksAsli = items.map(function (x) { return x.id; });
  $('ksItems').innerHTML = '';
  items.forEach(barisKs);
  if (!items.length) barisKs(null);
  ksBayar = 0;
  var h = '';
  (b.data ? b.data : []).forEach(function (p) {
    ksBayar += Number(p.jumlah);
    h += '<div class="row" style="cursor:default"><strong>' + rp(p.jumlah) + '</strong> - ' + esc(p.metode) + ' - ' + fmtWaktu(p.dibayar_pada) + '</div>';
  });
  $('ksRiwayat').innerHTML = h ? h : '<small style="color:var(--mut)">Belum ada pembayaran.</small>';
  $('ksDiskon').value = Number(ksInv.diskon) > 0 ? ksInv.diskon : '';
  var p0 = ksV.patients ? ksV.patients : {};
  var dk = ksV.doctors ? ksV.doctors.nama : '';
  $('ksHead').textContent = p0.no_rm + ' - ' + p0.nama;
  $('ksInfo').textContent = ksV.no_kunjungan + ' - ' + fmtTgl(ksV.tanggal) + (dk ? ' - ' + dk : '');
  var sisa = ringkasKs();
  $('ksJumlah').value = sisa > 0 ? sisa : '';
  $('ksTerima').value = '';
  ringkasKs();
  $('ksMsg').textContent = '';
  $('ksForm').classList.remove('hide');
  $('ksForm').scrollIntoView();
}
