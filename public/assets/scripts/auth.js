import firebase from './firebase-app'
import { getFormValues, loginUser, showAlertError } from "./utils";

export function verifyAuth(renderPage) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            renderPage(user.uid)
        } else {
            location.href = '/login.html'
        }
    })
}

const authPage = document.querySelector("body#auth");

if (authPage) {

    const auth = firebase.auth();

    const formAuthLogin = document.getElementById("form-login");
    const forgotThePassword = document.getElementById("form-forget");

    if (formAuthLogin) {

        const btnSubmit = formAuthLogin.querySelector('button[type=submit]');

        formAuthLogin.addEventListener("submit", async (e) => {

            e.preventDefault();

            btnSubmit.disabled = true;
            btnSubmit.innerText = 'Enviando...';

            const values = getFormValues(formAuthLogin);

            await loginUser(values.email, values.password);

            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Enviar';
        });
    }

    if (forgotThePassword) {

        const btnSubmit = forgotThePassword.querySelector('button[type=submit]');

        forgotThePassword.addEventListener("submit", (e) => {

            e.preventDefault();

            btnSubmit.disabled = true;
            btnSubmit.innerText = 'Enviando...';
            
            const values = getFormValues(forgotThePassword);

            auth.sendPasswordResetEmail(values.email)
                .then((response) => {
                    alert('Mensagem enviada! Verifique seu E-mail!');
                    window.location.href = "login.html";
                })
                .catch((err) => {
                    showAlertError('Não há registro de usuário correspondente a este identificador. O usuário pode ter sido excluído.')
                })
                .finally(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = 'Enviar';
                });
        });
    }
}

const btnLogout = document.querySelector('header .logout');

if (btnLogout) {

    btnLogout.addEventListener('click', e => {

        e.preventDefault();
        
        firebase.auth().signOut()
            .then(logout => {
                location.href = '/login.html';
            }).catch(err => {
                console.error(err);
            });
    });
}