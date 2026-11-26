async function cariPasienK() {
  var q = $('kq').value.trim().replace(/[%,()*]/g, '');
  if (q.length < 2) { $('kHasil').innerHTML = ''; return; }
  var r = await sb.from('patients').select('id,no_rm,nama').is('deleted_at', null)
    .or('nama.ilike.%' + q + '%,no_rm.ilike.%' + q + '%').limit(8);
  kHasilData = r.data ? r.data : [];
  var h = '';
  kHasilData.forEach(function (p, i) {
    h += '<div class="row" data-i="' + i + '"><span class="rm">' + esc(p.no_rm) + '</span> <strong>' + esc(p.nama) + '</strong></div>';
  });
  $('kHasil').innerHTML = h ? h : '<small style="color:var(--mut)">Pasien tidak ditemukan.</small>';
}

function pilihPasien(i) {
  var p = kHasilData[i];
  if (!p) return;
  kPasienId = p.id;
  $('kPasien').textContent = 'Pasien: ' + p.no_rm + ' - ' + p.nama;
  $('kHasil').innerHTML = '';
  $('kq').value = '';
  $('kForm').classList.remove('hide');
  $('kMsg').textContent = '';
}

function resetForm() {
  kPasienId = null;
  $('kForm').classList.add('hide');
  $('kKeluhan').value = '';
}
