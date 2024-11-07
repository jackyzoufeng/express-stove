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