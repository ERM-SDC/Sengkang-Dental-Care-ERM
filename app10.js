async function bukaRekam(i) {
  var v = rData[i];
  if (!v) return;
  rVisit = v;
  var a = await sb.from('soap_notes').select('*').eq('visit_id', v.id).is('deleted_at', null).maybeSingle();
  var b = await sb.from('visit_procedures').select('id,nama_tindakan,tarif').eq('visit_id', v.id).is('deleted_at', null);
  var c = await sb.from('patient_medical_history').select('*').eq('patient_id', v.patient_id).is('deleted_at', null).limit(1);
  var soap = a.data ? a.data : {};
  RF.forEach(function (g) {
    var o = soap[g[0]] ? soap[g[0]] : {};
    g[2].forEach(function (f) { isi('r_' + f[0], o[f[0]]); });
  });
  if (!soap.id) isi('r_keluhan', v.keluhan_utama);
  var p = v.patients ? v.patients : {};
  var dk = v.doctors ? v.doctors.nama : '';
  $('rHead').textContent = p.no_rm + ' - ' + p.nama;
  $('rInfo').textContent = v.no_kunjungan + ' - ' + v.jenis + ' - ' + v.status + (dk ? ' - ' + dk : '');
  var m = c.data && c.data[0] ? c.data[0] : {};
  var mt = [];
  if (m.alergi) mt.push('Alergi: ' + m.alergi);
  if (m.penyakit_sistemik) mt.push('Penyakit sistemik: ' + m.penyakit_sistemik);
  if (m.obat_rutin) mt.push('Obat rutin: ' + m.obat_rutin);
  $('rMedis').textContent = mt.length ? mt.join(' | ') : 'Belum ada catatan alergi, penyakit sistemik, atau obat rutin.';
  $('rTind').innerHTML = '';
  var procs = b.data ? b.data : [];
  rAsli = procs.map(function (x) { return x.id; });
  procs.forEach(tambahT);
  if (!procs.length) tambahT(null);
  hitungT();
  $('rMsg').textContent = '';
  $('rForm').classList.remove('hide');
  $('rForm').scrollIntoView();
}
