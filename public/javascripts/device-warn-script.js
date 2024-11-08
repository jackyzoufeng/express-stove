function funclose(obj) {
  var span = document.querySelector(`#${obj} > td:nth-child(2) > span`);
  span.setAttribute('class','status-off');
}

function fundelete(obj) {
  var tr = document.querySelector(`#${obj}`);
  var table = tr.parentNode;
  table.removeChild(tr);
}