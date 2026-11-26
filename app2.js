var tmr;

async function muatDaftar() {
  var q = $('q').value.trim().replace(/[%,()*]/g, '');
  var r = sb.from('patients').select('id,no_rm,nama,nik,no_hp,tanggal_lahir,jenis_kelamin')
    .is('deleted_at', null).order('updated_at', { ascending: false }).limit(50);
  if (q) {
    r = r.or('nama.ilike.%' + q + '%,no_rm.ilike.%' + q + '%,nik.ilike.%' + q + '%,no_hp.ilike.%' + q + '%');
  }
  var res = await r;
  if (res.error) {
    $('list').innerHTML = '<div class="err">Gagal memuat data: ' + esc(res.error.message) + '</div>';
    return;
  }
  var data = res.data;
  if (!data.length) {
    $('list').innerHTML = '<small style="color:var(--mut)">Belum ada pasien.</small>';
    return;
  }
  var h = '';
  data.forEach(function (p) {
    var info = [p.jenis_kelamin, umur(p.tanggal_lahir), p.no_hp].filter(Boolean).join(' - ');
    h += '<div class="row" data-id="' + esc(p.id) + '"><span class="rm">' + esc(p.no_rm) +
      '</span> <strong>' + esc(p.nama) + '</strong><br><small>' + esc(info) + '</small></div>';
  });
  $('list').innerHTML = h;
}

async function detail(id) {
  var a = await sb.from('patients').select('*').eq('id', id).single();
  var b = await sb.from('patient_medical_history').select('*').eq('patient_id', id).is('deleted_at', null).limit(1);
  if (a.error) { alert('Gagal memuat pasien.'); return; }
  var p = a.data;
  var h = (b.data && b.data[0]) || {};
  var lahir = [p.tempat_lahir, p.tanggal_lahir].filter(Boolean).join(', ');
  if (p.tanggal_lahir) lahir += ' (' + umur(p.tanggal_lahir) + ')';
  var rows = [
    ['Nomor RM', p.no_rm], ['Nama', p.nama], ['NIK', p.nik], ['Nomor BPJS', p.no_bpjs],
    ['Jenis kelamin', p.jenis_kelamin], ['Tempat, tanggal lahir', lahir],
    ['Nomor HP', p.no_hp], ['Pekerjaan', p.pekerjaan], ['Alamat', p.alamat],
    ['Penanggung jawab', [p.penanggung_jawab, p.no_hp_pj].filter(Boolean).join(' - ')],
    ['Alergi', h.alergi], ['Penyakit sistemik', h.penyakit_sistemik], ['Obat rutin', h.obat_rutin]
  ];
  var out = '<h2>' + esc(p.nama) + '</h2><dl>';
  rows.forEach(function (r) {
    if (r[1]) out += '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>';
  });
  out += '</dl>';
  $('dlgBody').innerHTML = out;
  $('dlg').showModal();
}
