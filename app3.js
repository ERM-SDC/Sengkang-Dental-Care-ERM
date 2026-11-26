var F = [
  ['nama', 'Nama lengkap *', 'text'], ['nik', 'NIK', 'text'], ['no_bpjs', 'Nomor BPJS', 'text'],
  ['jenis_kelamin', 'Jenis kelamin', 'sel', ['Laki-laki', 'Perempuan']],
  ['tempat_lahir', 'Tempat lahir', 'text'], ['tanggal_lahir', 'Tanggal lahir', 'date'],
  ['no_hp', 'Nomor HP', 'tel'], ['pekerjaan', 'Pekerjaan', 'text'], ['alamat', 'Alamat', 'text'],
  ['penanggung_jawab', 'Nama penanggung jawab', 'text'], ['no_hp_pj', 'HP penanggung jawab', 'tel']
];
var M = [['alergi', 'Alergi'], ['penyakit_sistemik', 'Penyakit sistemik'], ['obat_rutin', 'Obat rutin']];

function bukaForm() {
  var h = '';
  F.forEach(function (f) {
    h += '<div><label for="f_' + f[0] + '">' + f[1] + '</label>';
    if (f[2] === 'sel') {
      h += '<select id="f_' + f[0] + '"><option value="">-</option>';
      f[3].forEach(function (x) { h += '<option>' + x + '</option>'; });
      h += '</select>';
    } else {
      h += '<input id="f_' + f[0] + '" type="' + f[2] + '">';
    }
    h += '</div>';
  });
  M.forEach(function (m) {
    h += '<div><label for="f_' + m[0] + '">' + m[1] + '</label><input id="f_' + m[0] + '" type="text"></div>';
  });
  $('form').innerHTML = h;
  $('formMsg').textContent = '';
  $('formCard').classList.remove('hide');
  $('f_nama').focus();
}

async function simpan() {
  var v = function (k) { var x = $('f_' + k).value.trim(); return x === '' ? null : x; };
  if (!v('nama')) {
    $('formMsg').className = 'err';
    $('formMsg').textContent = 'Nama wajib diisi.';
    return;
  }
  $('btnSave').disabled = true;
  try {
    var rec = {};
    F.forEach(function (f) { rec[f[0]] = v(f[0]); });
    var res = await sb.from('patients').insert(rec).select('id,no_rm').single();
    if (res.error) {
      $('formMsg').className = 'err';
      $('formMsg').textContent = 'Gagal menyimpan: ' + res.error.message;
      $('btnSave').disabled = false;
      return;
    }
    var h = { patient_id: res.data.id };
    var ada = false;
    M.forEach(function (m) { h[m[0]] = v(m[0]); if (h[m[0]]) ada = true; });
    if (ada) await sb.from('patient_medical_history').insert(h);
    $('formCard').classList.add('hide');
    $('q').value = '';
    await muatDaftar();
    alert('Pasien tersimpan. Nomor RM: ' + res.data.no_rm);
  } catch (e) {
    $('formMsg').className = 'err';
    $('formMsg').textContent = 'Kesalahan: ' + e.message;
  }
  $('btnSave').disabled = false;
}

$('btnLogin').onclick = masuk;
$('pw').addEventListener('keydown', function (e) { if (e.key === 'Enter') masuk(); });
$('btnOut').onclick = keluar;
$('btnNew').onclick = bukaForm;
$('btnCancel').onclick = function () { $('formCard').classList.add('hide'); };
$('btnSave').onclick = simpan;
$('dlgClose').onclick = function () { $('dlg').close(); };
$('q').addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(muatDaftar, 300); });
$('list').addEventListener('click', function (e) {
  var r = e.target.closest('.row');
  if (r) detail(r.dataset.id);
});
mulai();
