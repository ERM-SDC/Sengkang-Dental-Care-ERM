var stl = document.createElement('style');
stl.textContent = '@media screen{#cetak{display:none}}' +
  '@media print{body>*:not(#cetak){display:none!important}#cetak{display:block}@page{margin:12mm}}';
document.head.appendChild(stl);
var cetakDiv = document.createElement('div');
cetakDiv.id = 'cetak';
document.body.appendChild(cetakDiv);

function cetakHtml(h) {
  $('cetak').innerHTML = h;
  window.print();
}

function terbilang(n) {
  var s = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  n = Math.floor(n);
  if (n < 12) return s[n];
  if (n < 20) return terbilang(n - 10) + ' belas';
  if (n < 100) return terbilang(Math.floor(n / 10)) + ' puluh' + (n % 10 ? ' ' + terbilang(n % 10) : '');
  if (n < 200) return 'seratus' + (n > 100 ? ' ' + terbilang(n - 100) : '');
  if (n < 1000) return terbilang(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + terbilang(n % 100) : '');
  if (n < 2000) return 'seribu' + (n > 1000 ? ' ' + terbilang(n - 1000) : '');
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' ribu' + (n % 1000 ? ' ' + terbilang(n % 1000) : '');
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + ' juta' + (n % 1000000 ? ' ' + terbilang(n % 1000000) : '');
  return terbilang(Math.floor(n / 1000000000)) + ' miliar' + (n % 1000000000 ? ' ' + terbilang(n % 1000000000) : '');
}

function huruf(n) {
  var t = n > 0 ? terbilang(n) : 'nol';
  return t.charAt(0).toUpperCase() + t.slice(1) + ' rupiah';
}

$('ksTutup').insertAdjacentHTML('beforebegin', '<button class="alt" id="ksCetak">Cetak kuitansi</button>');
$('ksCetak').onclick = function () { cetakKuitansi(); };
