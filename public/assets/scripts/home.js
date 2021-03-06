import firebase from './firebase-app'

document.querySelectorAll('section.home').forEach(page => {

    const auth = firebase.auth()

    const login = () => {
        const user = 'test@test.com'
        const pass = '123456'

        auth.signInWithEmailAndPassword(user, pass)
            .then(logged => {
                console.log(auth.currentUser);
            }).catch(err => {
                console.log(err);
            })
    }

    const logout = () => {
        auth.signOut()
            .then(logout => {
                // location.href = '/login.html'
            }).catch(err => {
                console.log(err);
            })
    }

    setTimeout(login, 3000)
})
