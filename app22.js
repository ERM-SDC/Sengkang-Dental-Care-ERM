function soapOf(v) {
  var s = v.soap_notes;
  if (Array.isArray(s)) s = s[0];
  return s && !s.deleted_at ? s : null;
}

function soapHtml(sn) {
  var h = '';
  RF.forEach(function (g) {
    var o = sn && sn[g[0]] ? sn[g[0]] : {};
    g[2].forEach(function (f) {
      if (o[f[0]]) h += '<div style="margin-top:6px"><small style="color:var(--mut)">' + esc(f[1]) + '</small><br>' + esc(o[f[0]]) + '</div>';
    });
  });
  return h ? h : '<small style="color:var(--mut)">Belum ada catatan SOAP.</small>';
}

function tampilRw() {
  if (!rwData.length) { $('rwList').innerHTML = '<small style="color:var(--mut)">Belum ada kunjungan.</small>'; return; }
  var h = '';
  rwData.forEach(function (v, i) {
    var sn = soapOf(v);
    var dx = sn && sn.assessment && sn.assessment.dx ? sn.assessment.dx : '';
    var procs = (v.visit_procedures ? v.visit_procedures : []).filter(function (t) { return !t.deleted_at; });
    var nama = procs.map(function (t) { return t.nama_tindakan; }).join(', ');
    var c = hitungKs(v);
    var dk = v.doctors ? v.doctors.nama : '';
    h += '<div class="row rwh" data-i="' + i + '"><strong>' + fmtTgl(v.tanggal) + '</strong> <span class="st">' + esc(v.status) + '</span>' +
      (v.status === 'selesai' ? ' <span class="st">' + c.st + '</span>' : '') +
      '<br><small>' + esc(v.jenis) + (dk ? ' - ' + esc(dk) : '') + '</small>' +
      (v.keluhan_utama ? '<br>Keluhan: ' + esc(v.keluhan_utama) : '') + (dx ? '<br>Diagnosis: ' + esc(dx) : '') +
      (nama ? '<br>Tindakan: ' + esc(nama) : '') + '<br><small>Total ' + rp(c.total) + '</small></div>' +
      '<div class="hide" id="rwd_' + i + '" style="padding:8px;background:#f6faf9;border-radius:8px;margin-bottom:6px">' +
      soapHtml(sn) + '<div style="margin-top:8px"><small>Total ' + rp(c.total) + ' - Dibayar ' + rp(c.bayar) + ' - Sisa ' + rp(c.sisa) +
      '</small></div><div style="margin-top:8px"><button class="alt rwb" data-i="' + i + '">Buka di Rekam Medis</button></div></div>';
  });
  $('rwList').innerHTML = h;
        }
