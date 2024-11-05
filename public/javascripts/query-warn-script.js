const homeimage = document.querySelector(".image-item");
homeimage.addEventListener("click", () => {
	window.location.href = "/";
});
const prevbtn = document.querySelector("#prev-page");
const nextbtn = document.querySelector("#next-page");
prevbtn.addEventListener("click", () => {
	window.location.href = "/query/warn-prevpage";
});
nextbtn.addEventListener("click", () => {
	window.location.href = "/query/warn-nextpage";
});