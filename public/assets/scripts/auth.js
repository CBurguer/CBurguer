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

export function logout() {
    auth.signOut()
        .then(logout => {
            location.href = '/login.html'
        }).catch(err => {
            console.log(err)
        })
}