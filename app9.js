function isi(id, v) { $(id).value = v ? v : ''; }

function tutupRekam() {
  rVisit = null;
  $('rForm').classList.add('hide');
}

async function muatAntrean() {
  var r = await sb.from('visits')
    .select('id,patient_id,no_kunjungan,jam_datang,jenis,status,keluhan_utama,patients(no_rm,nama),doctors(nama)')
    .eq('tanggal', hariIni()).is('deleted_at', null).order('jam_datang', { ascending: true });
  if (r.error) { $('rList').innerHTML = '<div class="err">Gagal memuat: ' + esc(r.error.message) + '</div>'; return; }
  rData = r.data ? r.data : [];
  if (!rData.length) { $('rList').innerHTML = '<small style="color:var(--mut)">Belum ada kunjungan hari ini.</small>'; return; }
  var h = '';
  rData.forEach(function (k, i) {
    var p = k.patients ? k.patients : {};
    h += '<div class="row" data-i="' + i + '"><span class="rm">' + esc(k.no_kunjungan) + '</span> <strong>' + esc(p.nama) +
      '</strong> <span class="st">' + esc(k.status) + '</span><br><small>' + esc(String(k.jam_datang).slice(0, 5)) + ' - ' +
      esc(k.jenis) + (k.keluhan_utama ? ' - ' + esc(k.keluhan_utama) : '') + '</small></div>';
  });
  $('rList').innerHTML = h;
}

function tambahT(p) {
  var d = document.createElement('div');
  d.className = 'trow';
  d.innerHTML = '<input class="tn" list="dlT2" placeholder="Nama tindakan">' +
    '<input class="tb" type="number" min="0" inputmode="numeric" placeholder="Biaya (Rp)">' +
    '<button type="button" class="alt th">Hapus</button>';
  if (p) {
    d.dataset.id = p.id;
    d.querySelector('.tn').value = p.nama_tindakan;
    d.querySelector('.tb').value = p.tarif;
  }
  $('rTind').appendChild(d);
}

function hitungT() {
  var t = 0;
  $('rTind').querySelectorAll('.tb').forEach(function (x) { t += Number(x.value); });
  $('rTotal').textContent = 'Total: ' + rp(t);
}
