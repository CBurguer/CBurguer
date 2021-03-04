import firebase from "./firebase-app";
import { getFormValues } from "./utils";

const authPage = document.querySelector("body#auth");

if (authPage) {
  const auth = firebase.auth();

  const formAuthRegister = document.getElementById("form-register");
  const formAuthLogin = document.getElementById("form-login");
  const forgotThePassword = document.getElementById("form-forget");

  if (formAuthRegister) {
    formAuthRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      const values = getFormValues(formAuthRegister);

      auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((response) => {
          console.log("response", response);
          window.location.href = "login.html";
        })
        .catch((err) => {
          console.log("err", err);
        });
    });
  }

  if (formAuthLogin) {
    formAuthLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const values = getFormValues(formAuthLogin);

      auth
        .signInWithEmailAndPassword(values.email, values.password)
        .then((response) => {
          const { user } = response;
          console.log("response", response);

          if (user != null) {
            window.location.href = "index.html";
          } else {
            console.log("usuario não logado");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    });
  }

  if (forgotThePassword) {
    forgotThePassword.addEventListener("submit", (e) => {
      e.preventDefault();
      const values = getFormValues(forgotThePassword);

      auth
        .sendPasswordResetEmail(values.email)
        .then((response) => {
          console.log("response", response);
          window.location.href = "login.html";
        })
        .catch((err) => {
          console.log("err", err);
        });
    });
  }
}
