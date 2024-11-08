var param = JSON.parse(decodeURI(paramobj));
const homeimage = document.querySelector(".image-item");
homeimage.addEventListener("click", () => {
  window.history.back();
});
const dataspans = document.querySelectorAll(".menu-item");
dataspans[0].addEventListener("click", () => {
  window.location.replace(`/deviceinfo/${param.devid}/devicename/${encodeURI(param.name)}`);
});
dataspans[1].addEventListener("click", () => {
  window.location.replace(`/devicecurve/${param.devid}/devicename/${encodeURI(param.name)}`);
});
dataspans[2].addEventListener("click", () => {
  window.location.replace(`/devicewarn/${param.devid}/devicename/${encodeURI(param.name)}`);
});
