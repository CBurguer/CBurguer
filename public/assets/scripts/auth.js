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

      // firebase auth tratando com promisses
      auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((response) => {
          const { user } = response;

          user.updateProfile({
            displayName: values.name,
          });
          console.log("response", response);
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
    });
  }
}
