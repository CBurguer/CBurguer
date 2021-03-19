import firebase from "./firebase-app";
import { getFormValues, showAlertError } from "./utils";

const authPage = document.querySelector("body#auth");

if (authPage) {

  const auth = firebase.auth();

  const formAuthLogin = document.getElementById("form-login");
  const forgotThePassword = document.getElementById("form-forget");

  if (formAuthLogin) {

    const btnSubmit = formAuthLogin.querySelector('button[type=submit]');

    formAuthLogin.addEventListener("submit", (e) => {

      e.preventDefault();

      btnSubmit.disabled = true;
      btnSubmit.innerText = 'Enviando...';

      const values = getFormValues(formAuthLogin);

      auth
        .signInWithEmailAndPassword(values.email, values.password)
        .then(({user}) => {
          if (user) {
            window.location.href = "index.html";
          }
        })
        .catch((err) => {
          showAlertError('Usuário e/ou senha incorreto(s).');
        })
        .finally(() => {
          btnSubmit.disabled = false;
          btnSubmit.innerText = 'Enviar';
        });
    });
  }

  if (forgotThePassword) {

    const btnSubmit = forgotThePassword.querySelector('button[type=submit]');

    forgotThePassword.addEventListener("submit", (e) => {

      e.preventDefault();

      btnSubmit.disabled = true;
      btnSubmit.innerText = 'Enviando...';
      
      const values = getFormValues(forgotThePassword);

      auth
        .sendPasswordResetEmail(values.email)
        .then((response) => {
          alert('Mensagem enviada! Verifique seu E-mail!');
          window.location.href = "login.html";
        })
        .catch((err) => {
          showAlertError('Não há registro de usuário correspondente a este identificador. O usuário pode ter sido excluído.');
        })
        .finally(() => {
          btnSubmit.disabled = false;
          btnSubmit.innerText = 'Enviar';
        });
    });
  }
}
