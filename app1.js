var SB_URL = 'https://ypmrbbccpgsrulvhsrkn.supabase.co';
var SB_KEY = 'sb_publishable_rOYB_Y-z5JcJNnd1B3fTzg_Z3XbLoJI';
var sb = supabase.createClient(SB_URL, SB_KEY);
var $ = function (id) { return document.getElementById(id); };
var ROLE = { admin: 'Admin', dokter: 'Dokter', asisten: 'Asisten/Perawat', kasir: 'Kasir' };

function esc(s) {
  var d = document.createElement('div');
  d.textContent = (s === null || s === undefined) ? '' : String(s);
  return d.innerHTML;
}

function umur(d) {
  if (!d) return '';
  var b = new Date(d), n = new Date();
  var a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a + ' th';
}

async function masuk() {
  $('loginErr').textContent = '';
  $('btnLogin').disabled = true;
  try {
    var res = await sb.auth.signInWithPassword({ email: $('em').value.trim(), password: $('pw').value });
    if (res.error) { $('loginErr').textContent = 'Email atau kata sandi salah.'; }
    else { await mulai(); }
  } catch (e) {
    $('loginErr').textContent = 'Kesalahan: ' + e.message;
  }
  $('btnLogin').disabled = false;
}

async function mulai() {
  var s = await sb.auth.getSession();
  var session = s.data.session;
  if (!session) { tampil(false); return; }
  var r = await sb.from('users').select('nama_lengkap,role_id,aktif').eq('id', session.user.id).maybeSingle();
  var data = r.data;
  if (r.error  !data  !data.aktif) {
    await sb.auth.signOut();
    $('loginErr').textContent = 'Akun ini belum terdaftar atau tidak aktif. Hubungi admin.';
    tampil(false);
    return;
  }
  $('uNama').textContent = data.nama_lengkap;
  $('uRole').textContent = ROLE[data.role_id] || data.role_id;
  tampil(true);
  muatDaftar();
  setIdle();
}

function tampil(app) {
  $('vLogin').classList.toggle('hide', app);
  $('vApp').classList.toggle('hide', !app);
  if (!app) { $('pw').value = ''; }
}

async function keluar() {
  await sb.auth.signOut();
  tampil(false);
}

var idleT;
function setIdle() {
  clearTimeout(idleT);
  idleT = setTimeout(async function () {
    await keluar();
    $('loginErr').textContent = 'Sesi berakhir karena tidak ada aktivitas.';
  }, 900000);
}
['click', 'keydown', 'touchstart'].forEach(function (e) {
  document.addEventListener(e, function () {
    if (!$('vApp').classList.contains('hide')) setIdle();
  });
});
