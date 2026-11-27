function bukaDariRiwayat(i) {
  var v = rwData[i];
  if (!v) return;
  tab('rekam');
  rData = [v];
  bukaRekam(0);
}

$('rwList').addEventListener('click', function (e) {
  var b = e.target.closest('.rwb');
  if (b) { bukaDariRiwayat(Number(b.dataset.i)); return; }
  var h = e.target.closest('.rwh');
  if (h) $('rwd_' + h.dataset.i).classList.toggle('hide');
});
