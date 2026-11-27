async function aksiKs(bayarJuga) {
  if (!ksInv) return;
  var jml = Number($('ksJumlah').value);
  $('ksMsg').className = 'err';
  if (bayarJuga && !(jml > 0)) { $('ksMsg').textContent = 'Isi jumlah pembayaran.'; return; }
  $('ksBayar').disabled = true;
  $('ksSimpan').disabled = true;
  try {
    await simpanTagihan();
    var t = await totalServer();
    var kembali = 0;
    if (bayarJuga) {
      if (jml > t.total - t.bayar) throw new Error('Jumlah melebihi sisa tagihan (' + rp(t.total - t.bayar) + ').');
      var sess = await sb.auth.getSession();
      var ins = await sb.from('payments').insert({ invoice_id: ksInv.id, jumlah: jml, metode: $('ksMetode').value, kasir_id: sess.data.session.user.id });
      if (ins.error) throw new Error(ins.error.message);
      t.bayar += jml;
      if ($('ksMetode').value === 'Cash') kembali = Number($('ksTerima').value) - jml;
    }
    await sb.from('invoices').update({ status: stInv(t.total, t.bayar), updated_at: new Date().toISOString() }).eq('id', ksInv.id);
    await renderTagihan();
    $('ksMsg').className = 'ok';
    $('ksMsg').textContent = bayarJuga ? 'Pembayaran tercatat.' : 'Tagihan tersimpan.';
    if (kembali > 0) alert('Kembalian: ' + rp(kembali));
    muatKasir();
  } catch (e) {
    $('ksMsg').className = 'err';
    $('ksMsg').textContent = 'Gagal: ' + e.message;
  }
  $('ksBayar').disabled = false;
  $('ksSimpan').disabled = false;
}

async function syncRM() {
  if (!ksInv) return;
  if (!confirm('Ganti rincian biaya dengan data dari rekam medis? Biaya yang ditambah manual akan hilang.')) return;
  var now = new Date().toISOString();
  for (var j = 0; j < ksAsli.length; j++) {
    await sb.from('invoice_items').update({ deleted_at: now }).eq('id', ksAsli[j]);
  }
  await isiDariRM();
  await renderTagihan();
}
