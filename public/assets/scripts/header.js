var header = document.querySelector(".header");

if (header) {

  var open = document.querySelector(".open-menu");
  var close = document.querySelector(".close-menu");
  var contact = document.querySelector("#contact-link");

  if (open) {
    open.addEventListener("click", () => {
      header.classList.add("menu-open");
    });
  }

  if (close) {
    close.addEventListener("click", () => {
      header.classList.remove("menu-open");
    });
  }

  if (contact) {
    contact.addEventListener("click", () => {
      header.classList.remove("menu-open");
    });
  }
}
