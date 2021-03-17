import firebase from './firebase-app'

const header = document.querySelector(".header");

if (header) {

  const open = document.querySelector(".open-menu");
  const close = document.querySelector(".close-menu");
  const contact = document.querySelector("#contact-link");
  const email = document.querySelector('.email');
  const avatar = document.querySelector('header #avatar');

  firebase.auth().onAuthStateChanged(user => {

      if (user) {

        email.innerHTML = user.email;
        
        firebase.storage().ref(`users/${user.uid}.png`).getDownloadURL().then(url => {
          if (url) avatar.src = url;
        });
      }
  })

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
