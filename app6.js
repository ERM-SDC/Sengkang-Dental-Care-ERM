async function simpanKunjungan() {
  if (!kPasienId) { $('kMsg').className = 'err'; $('kMsg').textContent = 'Pilih pasien dulu.'; return; }
  var tind = [];
  $('kRows').querySelectorAll('.trow').forEach(function (r) {
    var nama = r.querySelector('.tn').value.trim();
    var biaya = Number(r.querySelector('.tb').value);
    if (nama) tind.push({ nama_tindakan: nama, qty: 1, tarif: biaya });
  });
  $('kSimpan').disabled = true;
  try {
    var now = new Date();
    var dok = $('kDokter').value;
    var v = await sb.from('visits').insert({
      patient_id: kPasienId,
      doctor_id: dok ? dok : null,
      tanggal: hariIni(),
      jam_datang: pad(now.getHours()) + ':' + pad(now.getMinutes()),
      keluhan_utama: $('kKeluhan').value.trim(),
      jenis: $('kJenis').value,
      status: 'menunggu'
    }).select('id,no_kunjungan').single();
    if (v.error) {
      $('kMsg').className = 'err';
      $('kMsg').textContent = 'Gagal menyimpan: ' + v.error.message;
    } else {
      if (tind.length) {
        tind.forEach(function (t) { t.visit_id = v.data.id; });
        var p = await sb.from('visit_procedures').insert(tind);
        if (p.error) { alert('Kunjungan tersimpan, tetapi tindakan gagal: ' + p.error.message); }
      }
      resetForm();
      await muatKunjungan();
      alert('Kunjungan terdaftar: ' + v.data.no_kunjungan);
    }
  } catch (e) {
    $('kMsg').className = 'err';
    $('kMsg').textContent = 'Kesalahan: ' + e.message;
  }
  $('kSimpan').disabled = false;
}
