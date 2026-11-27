function tutupKs() {
  ksV = null;
  ksInv = null;
  $('ksForm').classList.add('hide');
}

async function muatKasir() {
  var r = await sb.from('visits')
    .select('id,patient_id,no_kunjungan,tanggal,jam_datang,patients(no_rm,nama),doctors(nama),visit_procedures(tarif,qty,deleted_at),invoices(id,diskon,invoice_items(harga,qty,deleted_at),payments(jumlah,deleted_at))')
    .eq('status', 'selesai').is('deleted_at', null)
    .order('tanggal', { ascending: false }).order('jam_datang', { ascending: false }).limit(100);
  if (r.error) { $('ksList').innerHTML = '<div class="err">Gagal memuat: ' + esc(r.error.message) + '</div>'; return; }
  ksData = r.data ? r.data : [];
  var semua = $('ksFilter').value === 'semua';
  var h = '', pit = 0;
  ksData.forEach(function (v, i) {
    var c = hitungKs(v);
    if (c.st !== 'Lunas' && c.sisa > 0) pit += c.sisa;
    if (!semua && c.st === 'Lunas') return;
    var p = v.patients ? v.patients : {};
    h += '<div class="row" data-i="' + i + '"><span class="rm">' + esc(v.no_kunjungan) + '</span> <strong>' + esc(p.nama) +
      '</strong> <span class="st">' + c.st + '</span><br><small>' + fmtTgl(v.tanggal) + ' - Total ' + rp(c.total) +
      ' - Sisa ' + rp(c.sisa) + '</small></div>';
  });
  $('ksList').innerHTML = h ? h : '<small style="color:var(--mut)">Tidak ada tagihan.</small>';
  $('ksPiutang').textContent = 'Piutang: ' + rp(pit);
}

async function isiDariRM() {
  var b = await sb.from('visit_procedures').select('nama_tindakan,qty,tarif').eq('visit_id', ksV.id).is('deleted_at', null);
  var rows = [];
  (b.data ? b.data : []).forEach(function (x) {
    rows.push({ invoice_id: ksInv.id, deskripsi: x.nama_tindakan, qty: x.qty, harga: x.tarif });
  });
  if (rows.length) await sb.from('invoice_items').insert(rows);
}

async function bukaTagihan(i) {
  var v = ksData[i];
  if (!v) return;
  ksV = v;
  var a = await sb.from('invoices').select('id,diskon').eq('visit_id', v.id).is('deleted_at', null).order('updated_at', { ascending: true }).limit(1);
  ksInv = a.data && a.data[0] ? a.data[0] : null;
  if (!ksInv) {
    var c = await sb.from('invoices').insert({ visit_id: v.id }).select('id,diskon').single();
    if (c.error) { alert('Gagal membuat tagihan: ' + c.error.message); return; }
    ksInv = c.data;
    await isiDariRM();
  }
  await renderTagihan();
}
