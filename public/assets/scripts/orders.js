let btnExcluir = document.querySelectorAll(".excluir");
let liExc = document.querySelector(".liex");

btnExcluir.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    liExc.classList.add("ex-open");
    console.dir(e.target.parentElement);
  });
});
