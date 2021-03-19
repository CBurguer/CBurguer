import { formatCurrency } from './utils'
import { verifyAuth, logout } from './auth'
import firebase from './firebase-app'
import IMask from 'imask'
import moment from 'moment';

document.querySelectorAll('section#pay').forEach(page => {
    
    const renderPage = (uid) => {

        const db = firebase.firestore()
        const collectionOrdersRef = db.collection('carts').doc(uid).collection('orders').orderBy('created', 'desc').limit(1)
        const collectionBanksRef = db.collection('banks')
        const installmentsEl = page.querySelector('select[name=installments]')
        const validateEl = page.querySelector('input[name=validate]')
        const numberEl = page.querySelector('input[name=number]')
        const bankEl = page.querySelector('select[name=bank]')
        const cvvEL = page.querySelector('input[name=code]')
        const form = page.querySelector('form')

        const calcInterest = (nrInstallment, interestRate, amount, returnString = true) => {
            const totalInstallment = amount + (amount * ((nrInstallment * interestRate) / 100))
            const vlInstallment = totalInstallment / nrInstallment

            if (returnString) {
                return `${formatCurrency(vlInstallment)} (${formatCurrency(totalInstallment)})`
            }  else {
                return totalInstallment
            }
        
        }
        
        const renderBanks = async ({ id, name }) => {
            if (bankEl.querySelector(`[value='${id}']`))
                bankEl.innerHTML = ''

            if (!bankEl.querySelector('[selected]'))
                bankEl.innerHTML = '<option value selected>Selecione o banco</option>'

            bankEl.innerHTML += `
                <option value='${id}'>
                    ${name}
                </option>
            `

            installmentsEl.style.display = 'none'
        }
        
        const renderInstallments = ({ maxInstallments, interestRate }, { subtotal }) => {
            installmentsEl.innerHTML = ''

            for (let count = 1; count <= maxInstallments; count++) {
                if (count === 1) {
                    installmentsEl.innerHTML += `
                        <option value='${count}' data-total='${subtotal}'>
                            ${count} parcela de ${formatCurrency(subtotal)} (${formatCurrency(subtotal)})
                        </option>
                    `
                } else {
                    installmentsEl.innerHTML += `
                        <option value='${count}' data-total='${calcInterest(count, interestRate, subtotal, false)}'>
                            ${count} parcelas de ${calcInterest(count, interestRate, subtotal)}
                        </option>
                    `
                }
            }
        }

        const validateForm = () => {
            let valid = true

            page.querySelectorAll('[name]').forEach(e => {
                let error = null

                const alertEl = page.querySelector(`small#${e.name}`)
        
                if (e.name === 'number' && e.value.replaceAll(' ', '').length < 16) {
                    error = 'O cartão deve conter 16 dígitos'
                } else if (e.name === 'validate' && e.value.replaceAll('/', '').length < 4) {
                    error = 'A validade do cartão deve conter 4 dígitos'
                } else if (e.name === 'code' && e.value.length < 3) {
                    error = 'O CVV do cartão deve conter no mínimo 3 dígitos'
                } else if (e.name === 'name' && e.value.length < 3) {
                    error = 'O nome deve conter pelomenos 3 caracteres'
                } else if (e.name === 'bank' && !e.value.length) {
                    error = 'Escolha o seu banco'
                }

                if (error) {
                    if (!alertEl) {
                        e.insertAdjacentHTML(
                            'afterend', 
                            `<small id='${e.name}' style='color:#ff0000; margin-bottom:1rem;'>${error}</small>`
                        )
                        e.style.borderColor = '#ff0000'
                    }
                    
                    valid = false
                } else if (alertEl) {
                    alertEl.remove()
                    e.style.borderColor = '#d7d7d7'
                }
            })

            return valid
        }

        new IMask(numberEl, {
            mask: '0000 0000 0000 0000'
        })

        let momentFormat = 'MM/YY';
        new IMask(validateEl, {
            mask: Date,
            pattern: momentFormat,
            min: new Date(2021, 2, 0),
            max: new Date(2099, 0, 0),

            format: function (date) {
                return moment(date).format(momentFormat);
            },
            parse: function (str) {
                return moment(str, momentFormat);
            },
            blocks: {
                YY: {
                    mask: IMask.MaskedRange,
                    from: 21,
                    to: 99
                },
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12
                },
            }
        })

        new IMask(cvvEL, {
            mask: '000[0]'
        })

        db.collection('banks')
            .onSnapshot(snapshot => snapshot
            .forEach(item => renderBanks(item.data())))

        page.querySelector('button').addEventListener('click', async () => {
            if (validateForm()) {
                const formData = new FormData(form);

                const snapshotOrders = await collectionOrdersRef.get()
                const { total } = installmentsEl.options[installmentsEl.selectedIndex].dataset

                snapshotOrders.forEach(async doc => {
                    try {
                        await db.collection('payments').doc(doc.id).set({
                            bank: +formData.get('bank'),
                            code: +formData.get('code'),
                            name: formData.get('name'),
                            number: formData.get('number'),
                            validate: formData.get('validate'),
                            vlInstallment: total / formData.get('installments'),
                            total: +total,
                            nrInstallment: +formData.get('installments')
                        })

                        location.href = '/orders.html'
                    } catch (err) {
                        console.error(err);
                    }
                })
            } else {
                alert('Oops! Houve algum erro no formulário, verifique-o e tente novamente.')
            }
        })

        bankEl.addEventListener('change', async e => {
            const { value } = e.target
            if (value) {
                installmentsEl.style.display = 'block'
                const snapshotBanks = await collectionBanksRef.doc(value).get()

                collectionOrdersRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => renderInstallments(snapshotBanks.data(), doc.data()))
                })
            } else {
                installmentsEl.style.display = 'none'
            }
        })
    }

    verifyAuth(renderPage)
})

