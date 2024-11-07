const homeimage = document.querySelector(".image-item");
homeimage.addEventListener("click", () => {
	window.history.back();
});
const dataspans = document.querySelectorAll(".menu-item");
dataspans[0].addEventListener("click", () => {
	window.location.replace("/query/report");
});
dataspans[1].addEventListener("click", () => {
	window.location.replace("/query/report-curve");
});
const prevbtn = document.querySelector("#prev-page");
const nextbtn = document.querySelector("#next-page");
prevbtn.addEventListener("click", () => {
  window.location.replace("/query/report-prevpage");
});
nextbtn.addEventListener("click", () => {
  window.location.replace("/query/report-nextpage");
});
const exportbtn = document.querySelector("#export-to-excel");
exportbtn.addEventListener("click", () => {
  window.location.replace("/query/report-export");
});