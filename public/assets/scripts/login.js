import firebase from "./firebase-app";
import { getFormValues } from "./utils";

const authPage = document.querySelector("body#auth");

if (authPage) {
  const auth = firebase.auth();

  // seleciona o formulário com ID #form-register
  const formAuthRegister = document.querySelector("#form-register");

  // adiciona um evento de escuta no botão submit
  formAuthRegister.addEventListener("submit", (e) => {
    e.preventDefault(); //cancela o comportamento padrao do formulário

    //processando os dados do formulário com getFormValues
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
