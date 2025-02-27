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

        let updateLastBurguer = true;
        
        const renderBreadOptions = (context, breadOptions) => {
        
            const optionsEl = context.querySelector('#breads-list');
        
            optionsEl.innerHTML = '';
        
            breadOptions.forEach((item, index) => {
        
                const label = appendToTemplate(optionsEl, 'li',
                `<label>
                    <input type="radio" name="item"/>
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

                    saveCurrentBurger();
                    updateLastBurguer = true;
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

                    saveCurrentBurger();
                    updateLastBurguer = true;
                });
            });
        }
        
        const saveCurrentBurger = () => {

            const tray = getTray();

            if (updateLastBurguer) {
                tray.pop();
            }
    
            tray.push(currentBurguer);
    
            setTray(tray);
    
            renderTray();
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

                const addGreenColor = index !== tray.length ? "style='color:green'" : '';
        
                const total = calculateBurgerTotal(item);

                let ingredientsEl = '';

                if (item.bread) {
                    ingredientsEl += `<div>${item.bread.name}</div>`;
                }

                item.ingredients.forEach(ingredient => {
                    ingredientsEl += `<div>${ingredient.name}</div>` 
                });

                const li = appendToTemplate(listEl, 'li',
                    `<div class="hambuguer">
                        <div ${addGreenColor}>CBurguer ${index}</div>
                        <div ${addGreenColor}>${formatCurrency(total)}</div>
                        <button type="button" id="btn-delete" aria-label="Remover CBurguer ${index}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
                            </svg>
                        </button>
                    </div>
                    <div class="items">
                        ${ingredientsEl}
                    </div>
                    `
                );
        
                li.querySelector('#btn-delete').addEventListener('click', () => deleteBurguer(index - 1));
            });
        
            const subtotal = calculateTraySubTotal(tray);
        
            subtotalEl.innerHTML = `<small>Subtotal</small>${formatCurrency(subtotal)}`;
        
            if (tray.length === 0) {
        
                smallEl.innerText = 'Nenhum CBurguer';
        
            } else if (tray.length == 1) {
        
                smallEl.innerText = '1 CBurguer';
        
            } else {
        
                smallEl.innerText = tray.length + ' CBurguers';
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

            let trayIsValid = true;
          
            const tray = getTray();

            if (!tray || tray.length < 1) {

                showAlertError('A bandeja deve conter ao menos 1 CBurguer!');
                trayIsValid = false;
            } 
            
            tray.forEach((item, index) => {

                if (!item.bread || item.ingredients.length < 1) {

                    showAlertError(`O CBurguer ${index + 1} é inválido! Finalize sua seleção ou exclua-o da bandeja!`);
                    trayIsValid = false;
                    return;
                }
            });
                
            if (trayIsValid) {

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
                    console.error(err);
                    showAlertError('Não foi possível salvar seu pedido! Tente novamente mais tarde!');
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

        const clearBurguerSelection = (context) => {

            currentBurguer.ingredients = [];
            currentBurguer.bread = null;

            context.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
            context.querySelectorAll('input[type=radio]').forEach(radio => radio.checked = false);
        }

        loadBreads();

        loadIngredients();

        page.querySelector('#btn-save-burguer').addEventListener('click', e => {

            if (!currentBurguer.bread) {
                showAlertError('O CBurguer deve conter um pão!');
            } else if (currentBurguer.ingredients.length < 1) {
                showAlertError('O CBurguer deve conter ao menos 1 ingrediente!');
            } else {

                clearBurguerSelection(page);

                updateLastBurguer = false;

                alert('CBurguer salvo com sucesso!');
            }
        });
        
        if (trayEl) {
    
            trayEl.querySelector('#btn-open-tray').addEventListener('click', e => trayEl.classList.add('open'));
    
            trayEl.querySelector('#btn-close-tray').addEventListener('click', e => trayEl.classList.remove('open'));
    
            trayEl.querySelector('#btn-pay').addEventListener('click', e => saveOrder());
        }

        renderTray();
    }
});