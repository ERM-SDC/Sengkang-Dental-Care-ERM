const F = [
  ['nama','Nama lengkap *','text'],['nik','NIK','text'],['no_bpjs','Nomor BPJS','text'],
  ['jenis_kelamin','Jenis kelamin','sel',['Laki-laki','Perempuan']],
  ['tempat_lahir','Tempat lahir','text'],['tanggal_lahir','Tanggal lahir','date'],
  ['no_hp','Nomor HP','tel'],['pekerjaan','Pekerjaan','text'],['alamat','Alamat','text'],
  ['penanggung_jawab','Nama penanggung jawab','text'],['no_hp_pj','HP penanggung jawab','tel']
];
const M = [['alergi','Alergi'],['penyakit_sistemik','Penyakit sistemik'],['obat_rutin','Obat rutin']];

function bukaForm() {
  $('form').innerHTML =
    F.map(([k, l, t, o]) => <div><label for="f_${k}">${l}</label> +
      (t === 'sel' ? <select id="f_${k}"><option value="">-</option>${o.map(x => <option>${x}</option>).join('')}</select>
                   : <input id="f_${k}" type="${t}">) + '</div>').join('') +
    M.map(([k, l]) => <div><label for="f_${k}">${l}</label><input id="f_${k}" type="text"></div>).join('');
  $('formMsg').textContent = '';
  $('formCard').classList.remove('hide');
  $('f_nama').focus();
}

async function simpan() {
  const v = k => { const x = $('f_' + k).value.trim(); return x === '' ? null : x; };
  if (!v('nama')) { $('formMsg').className = 'err'; $('formMsg').textContent = 'Nama wajib diisi.'; return; }
  $('btnSave').disabled = true;
  const rec = {}; F.forEach(([k]) => rec[k] = v(k));
  const { data, error } = await sb.from('patients').insert(rec).select('id,no_rm').single();
  if (error) { $('btnSave').disabled = false; $('formMsg').className = 'err'; $('formMsg').textContent = 'Gagal menyimpan: ' + error.message; return; }
  const h = { patient_id: data.id }; let ada = false;
  M.forEach(([k]) => { h[k] = v(k); if (h[k]) ada = true; });
  if (ada) await sb.from('patient_medical_history').insert(h);
  $('btnSave').disabled = false;
  $('formCard').classList.add('hide');
  $('q').value = '';
  await muatDaftar();
  alert('Pasien tersimpan. Nomor RM: ' + data.no_rm);
}

$('btnLogin').onclick = masuk;
$('pw').addEventListener('keydown', e => { if (e.key === 'Enter') masuk(); });
$('btnOut').onclick = keluar;
$('btnNew').onclick = bukaForm;
$('btnCancel').onclick = () => $('formCard').classList.add('hide');
$('btnSave').onclick = simpan;
$('dlgClose').onclick = () => $('dlg').close();
$('q').addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(muatDaftar, 300); });
$('list').addEventListener('click', e => { const r = e.target.closest('.row'); if (r) detail(r.dataset.id); });
mulai();
