$('ksList').addEventListener('click', function (e) { var r = e.target.closest('.row'); if (r) bukaTagihan(Number(r.dataset.i)); });
$('ksFilter').addEventListener('change', muatKasir);
$('ksTambah').onclick = function () { barisKs(null); };
$('ksItems').addEventListener('input', ringkasKs);
$('ksItems').addEventListener('click', function (e) {
  if (e.target.classList.contains('th')) { e.target.parentNode.remove(); ringkasKs(); }
});
$('ksDiskon').addEventListener('input', ringkasKs);
$('ksJumlah').addEventListener('input', ringkasKs);
$('ksTerima').addEventListener('input', ringkasKs);
$('ksMetode').addEventListener('change', ringkasKs);
$('ksBayar').onclick = function () { aksiKs(true); };
$('ksSimpan').onclick = function () { aksiKs(false); };
$('ksSync').onclick = syncRM;
$('ksTutup').onclick = tutupKs;
$('lpKartu').addEventListener('click', function (e) {
  var k = e.target.closest('.lpk');
  if (k) { lpP = k.dataset.p; tampilLp(); }
});
