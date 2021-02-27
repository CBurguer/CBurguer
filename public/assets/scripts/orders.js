let btnLixeira = document.querySelectorAll(".excluir");
let btnCancelar = document.querySelectorAll(".btncan");
let btnExcluir = document.querySelectorAll(".btnex");

btnLixeira.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let liAct = btn.closest("li");
    let liDel = liAct.querySelector(".liex");
    liDel.classList.add("ex-open");
  });
});

//console.log(btnCancelar);

btnCancelar.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let liCan = e.target.parentElement;
    liCan.classList.remove("ex-open");
  });
});

btnExcluir.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let liAct = e.target.parentElement;
    let ulList = liAct.closest("ul");
    let liPai = ulList.closest("li");
    liPai.remove();
  });
});
