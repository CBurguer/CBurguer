import firebase from './firebase-app';
import { showAlertError, appendToTemplate, calculateBurgerTotal, calculateTraySubTotal, formatCurrency } from './utils';

document.querySelectorAll('#make-burguer').forEach(page => {

    let uid = null;
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            uid = user.uid;
            renderPage();
        } else {
            location.href = '/login.html';
        }
    });
    
    const renderPage = () => {

        const db = firebase.firestore();
        const trayEl = document.querySelector('#tray');
    
        const currentBurguer = {
            bread: null,
            ingredients: [],
        };
        
        const renderBreadOptions = (context, breadOptions) => {
        
            const optionsEl = context.querySelector('#breads-list');
        
            optionsEl.innerHTML = '';
        
            breadOptions.forEach(item => {
        
                const label = appendToTemplate(optionsEl, 'li',
                `<label>
                    <input type="radio" name="item" />
                    <span></span>
                    <h3>${item.name}</h3>
                    <div>${formatCurrency(item.price)}</div>
                </label>`);
        
                label.querySelector('[type=radio]').addEventListener('change', e => {
        
                    if (e.target.checked) {
                        currentBurguer.bread = item;
                    } else {
                        currentBurguer.bread = null;
                    }
                });
            });
        }
        
        const renderIngredientOptions = (context, ingredientOptions) => {
        
            const optionsEl = context.querySelector('#ingredients-list');
        
            optionsEl.innerHTML = '';
        
            ingredientOptions.forEach(item => {
        
                const label = appendToTemplate(optionsEl, 'li',
                `<label>
                    <input type="checkbox" name="item" />
                    <span></span>
                    <h3>${item.name}</h3>
                    <div>${formatCurrency(item.price)}</div>
                </label>`);
        
                label.querySelector('[type=checkbox]').addEventListener('change', e => {
        
                    if (e.target.checked) {
        
                        currentBurguer.ingredients.push(item);
                    } else {
        
                        currentBurguer.ingredients = currentBurguer.ingredients.filter(ingredient => {
                            return ingredient.id != item.id
                        });
                    }
                });
            });
        }
        
        const saveCurrentBurger = () => {
            
            if (!currentBurguer.bread) {
        
                alert('Selecione um pão!');
        
            } else if (currentBurguer.ingredients.length < 1) {
        
                alert('Selecione ao menos um ingrediente!');
        
            } else {
        
                const tray = getTray();
        
                tray.push(currentBurguer);
        
                setTray(tray);
        
                renderTray();
            }
        }
        
        const deleteBurguer = (index) => {
        
            const tray = JSON.parse(sessionStorage.getItem('tray'));
        
            tray.splice(index, 1);
        
            sessionStorage.setItem('tray', JSON.stringify(tray));
        
            renderTray();
        }
        
        const renderTray = () => {
        
            const smallEl = trayEl.querySelector('header > strong > small');
            const listEl = trayEl.querySelector('#hambuguers-list');
            const subtotalEl = trayEl.querySelector('footer > .price');
        
            listEl.innerHTML = '';
        
            const tray = getTray();
        
            tray.forEach((item, index) => {
        
                index += 1;
        
                const total = calculateBurgerTotal(item);
        
                const li = appendToTemplate(listEl, 'li',
                    `<div>Hamburguer ${index}</div>
                        <div>${formatCurrency(total)}</div>
                        <button type="button" id="btn-delete" aria-label="Remover Hamburguer ${index}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
                            </svg>
                        </button>`
                );
        
                li.querySelector('#btn-delete').addEventListener('click', () => deleteBurguer(index - 1));
            });
        
            const subtotal = calculateTraySubTotal(tray);
        
            subtotalEl.innerHTML = `<small>Subtotal</small>${formatCurrency(subtotal)}`;
        
            if (tray.length === 0) {
        
                smallEl.innerText = 'Nenhum hamburguer';
        
            } else if (tray.length == 1) {
        
                smallEl.innerText = '1 hamburguer';
        
            } else {
        
                smallEl.innerText = tray.length + ' hamburgueres';
            }
        }
        
        const getTray = () => {
        
            let tray = JSON.parse(sessionStorage.getItem('tray'));
        
            if (!tray) tray = [];
        
            return tray;
        }
        
        const setTray = (tray) => {
        
            sessionStorage.setItem('tray', JSON.stringify(tray));
        }
        
        const saveOrder = async () => {
          
            const tray = getTray();
        
            if (tray.length < 1) {

                showAlertError('A bandeja deve conter ao menos 1 item!');
        
            } else {
                
                try {

                    const tray = getTray();

                    await db.collection('carts').doc(uid).collection('orders').add({
                       active: 1,
                       created: new Date(),
                       subtotal: calculateTraySubTotal(tray),
                       items: tray
                    });

                    setTray([]);

                    window.location.href = '/pay.html';

                } catch (err) {
                    console.log(err);
                }
            }
        }

        const loadBreads = () => {

            db.collection('breads').onSnapshot(snapshot => {
    
                const breads = [];
        
                snapshot.forEach(bread => breads.push(bread.data()));
            
                renderBreadOptions(page, breads);
        
            }, showAlertError);
        }
    
        const loadIngredients = () => {

            db.collection('ingredients').onSnapshot(snapshot => {
    
                const ingredients = [];
        
                snapshot.forEach(bread => {
                    ingredients.push(bread.data());
                });
            
                renderIngredientOptions(page, ingredients);
        
            }, showAlertError);
        }

        loadBreads();

        loadIngredients();

        page.querySelector('#btn-save-burguer').addEventListener('click', e => saveCurrentBurger());
        
        if (trayEl) {
    
            trayEl.querySelector('#btn-open-tray').addEventListener('click', e => trayEl.classList.add('open'));
    
            trayEl.querySelector('#btn-close-tray').addEventListener('click', e => trayEl.classList.remove('open'));
    
            trayEl.querySelector('#btn-pay').addEventListener('click', e => saveOrder());
        }
    
        renderTray();
    }
});