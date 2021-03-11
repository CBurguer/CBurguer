var open = document.querySelector(".open-menu");
var close = document.querySelector(".close-menu");
var header = document.querySelector(".header");
var contact = document.querySelector("#contact-link");

open.addEventListener("click", () => {
  header.classList.add("menu-open");
});

close.addEventListener("click", () => {
  header.classList.remove("menu-open");
});

contact.addEventListener("click", () => {
  header.classList.remove("menu-open");
});
