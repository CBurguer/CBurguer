import firebase from './firebase-app'

export function verifyAuth(renderPage) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            renderPage(user.uid)
        } else {
            location.href = '/login.html'
        }
    })
}

const btnLogout = document.querySelector('header .logout');

if (btnLogout) {

    btnLogout.addEventListener('click', e => {

        e.preventDefault();
        
        firebase.auth().signOut()
            .then(logout => {
                location.href = '/login.html';
            }).catch(err => {
                console.log(err);
            });
    });
}