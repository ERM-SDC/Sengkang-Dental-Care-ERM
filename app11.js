async function simpanRekam(selesai) {
  if (!rVisit) return;
  $('rSimpan').disabled = true;
  $('rSelesai').disabled = true;
  $('rMsg').className = '';
  try {
    var now = new Date().toISOString();
    var soap = { visit_id: rVisit.id, updated_at: now };
    RF.forEach(function (g) {
      var o = {};
      g[2].forEach(function (f) { o[f[0]] = $('r_' + f[0]).value.trim(); });
      soap[g[0]] = o;
    });
    var s1 = await sb.from('soap_notes').upsert(soap, { onConflict: 'visit_id' });
    if (s1.error) throw new Error(s1.error.message);
    var rows = Array.from($('rTind').querySelectorAll('.trow'));
    var ada = {};
    for (var i = 0; i < rows.length; i++) {
      var nama = rows[i].querySelector('.tn').value.trim();
      var biaya = Number(rows[i].querySelector('.tb').value);
      var rid = rows[i].dataset.id;
      if (!nama) continue;
      var q;
      if (rid) {
        ada[rid] = true;
        q = await sb.from('visit_procedures').update({ nama_tindakan: nama, tarif: biaya, updated_at: now }).eq('id', rid);
      } else {
        q = await sb.from('visit_procedures').insert({ visit_id: rVisit.id, nama_tindakan: nama, qty: 1, tarif: biaya });
      }
      if (q.error) throw new Error(q.error.message);
    }
    for (var j = 0; j < rAsli.length; j++) {
      if (!ada[rAsli[j]]) await sb.from('visit_procedures').update({ deleted_at: now }).eq('id', rAsli[j]);
    }
    var st = selesai ? 'selesai' : (rVisit.status === 'menunggu' ? 'diperiksa' : rVisit.status);
    var s2 = await sb.from('visits').update({ status: st, updated_at: now }).eq('id', rVisit.id);
    if (s2.error) throw new Error(s2.error.message);
    if (selesai) {
      tutupRekam();
      await muatAntrean();
      alert('Kunjungan selesai dan siap ditagih di Kasir.');
    } else {
      rVisit.status = st;
      $('rMsg').className = 'ok';
      $('rMsg').textContent = 'Tersimpan.';
      muatAntrean();
    }
  } catch (e) {
    $('rMsg').className = 'err';
    $('rMsg').textContent = 'Gagal menyimpan: ' + e.message;
  }
  $('rSimpan').disabled = false;
  $('rSelesai').disabled = false;
}

$('rList').addEventListener('click', function (e) { var r = e.target.closest('.row'); if (r) bukaRekam(Number(r.dataset.i)); });
$('rTambah').onclick = function () { tambahT(null); };
$('rTind').addEventListener('input', hitungT);
$('rTind').addEventListener('click', function (e) {
  if (e.target.classList.contains('th')) { e.target.parentNode.remove(); hitungT(); }
});
$('rSimpan').onclick = function () { simpanRekam(false); };
$('rSelesai').onclick = function () { simpanRekam(true); };
$('rTutup').onclick = tutupRekam;
