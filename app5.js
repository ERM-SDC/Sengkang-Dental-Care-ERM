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
  if (!$('kRows').children.length) tambahRow();
}

function tambahRow() {
  var d = document.createElement('div');
  d.className = 'trow';
  d.innerHTML = '<input class="tn" list="dlTind" placeholder="Nama tindakan">' +
    '<input class="tb" type="number" min="0" inputmode="numeric" placeholder="Biaya (Rp)">' +
    '<button type="button" class="alt th">Hapus</button>';
  $('kRows').appendChild(d);
}

function hitungTotal() {
  var t = 0;
  $('kRows').querySelectorAll('.tb').forEach(function (x) { t += Number(x.value); });
  $('kTotal').textContent = 'Total: ' + rp(t);
}

function resetForm() {
  kPasienId = null;
  $('kForm').classList.add('hide');
  $('kRows').innerHTML = '';
  $('kKeluhan').value = '';
  $('kTotal').textContent = 'Total: Rp0';
    }
