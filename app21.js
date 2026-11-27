async function bukaRiwayat(id) {
  rwPid = id;
  tab('riwayat');
  $('nav').querySelectorAll('span').forEach(function (x) { x.classList.toggle('on', x.dataset.tab === 'pasien'); });
  $('rwList').innerHTML = '<small style="color:var(--mut)">Memuat...</small>';
  var a = await sb.from('patients').select('no_rm,nama,tanggal_lahir,jenis_kelamin').eq('id', id).single();
  var m = await sb.from('patient_medical_history').select('alergi,penyakit_sistemik,obat_rutin').eq('patient_id', id).is('deleted_at', null).limit(1);
  var p = a.data ? a.data : {};
  $('rwHead').textContent = p.no_rm + ' - ' + p.nama;
  $('rwInfo').textContent = [p.jenis_kelamin, umur(p.tanggal_lahir)].filter(Boolean).join(' - ');
  var mm = m.data && m.data[0] ? m.data[0] : {};
  var mt = [];
  if (mm.alergi) mt.push('Alergi: ' + mm.alergi);
  if (mm.penyakit_sistemik) mt.push('Penyakit sistemik: ' + mm.penyakit_sistemik);
  if (mm.obat_rutin) mt.push('Obat rutin: ' + mm.obat_rutin);
  $('rwMedis').textContent = mt.length ? mt.join(' | ') : 'Belum ada catatan alergi, penyakit sistemik, atau obat rutin.';
  var r = await sb.from('visits')
    .select('id,patient_id,no_kunjungan,tanggal,jam_datang,jenis,status,keluhan_utama,patients(no_rm,nama),doctors(nama),soap_notes(subjective,objective,assessment,plan,deleted_at),visit_procedures(nama_tindakan,tarif,qty,deleted_at),invoices(diskon,invoice_items(harga,qty,deleted_at),payments(jumlah,deleted_at))')
    .eq('patient_id', id).is('deleted_at', null)
    .order('tanggal', { ascending: false }).order('jam_datang', { ascending: false });
  if (r.error) { $('rwList').innerHTML = '<div class="err">Gagal memuat: ' + esc(r.error.message) + '</div>'; return; }
  rwData = r.data ? r.data : [];
  tampilRw();
}
