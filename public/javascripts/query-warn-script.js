const homeimage = document.querySelector(".image-item");
homeimage.addEventListener("click", () => {
	window.history.back();
});
const prevbtn = document.querySelector("#prev-page");
const nextbtn = document.querySelector("#next-page");
prevbtn.addEventListener("click", () => {
  window.location.replace("/query/warn-prevpage");
	//window.location.href = "/query/warn-prevpage";
});
nextbtn.addEventListener("click", () => {
  window.location.replace("/query/warn-nextpage");
	//window.location.href = "/query/warn-nextpage";
});
const exportbtn = document.querySelector("#export-to-excel");
exportbtn.addEventListener("click", () => {
  window.location.replace("/query/warn-export");
});