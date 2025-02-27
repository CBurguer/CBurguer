import firebase from "./firebase-app";

export function getFormValues(form) {
    const values = {};

    form.querySelectorAll("[name]").forEach((input) => {
        values[input.name] = input.value;
    });

    return values;
}

export function formatCurrency(value) {
  return Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function translateMessage(message) {

  console.log(message);
  if (message == 'auth/invalid-email') {
    alert('O endereço de e-mail está formatado incorretamente.')
  } else if (message == 'auth/weak-password') {
    alert('A senha deve ter 6 caracteres ou mais.')
  } else if (message == 'auth/email-already-in-use') {
    alert('E-mail informado já cadastrado.')
  } else {
    alert('Houve algum erro no formulário, verifique e tente novamente.')
  }
}

export function appendToTemplate(element, tagName, html) 
{
  const wrappElement = document.createElement(tagName);

  wrappElement.innerHTML = html;

  element.append(wrappElement);

  return wrappElement;
}

export function calculateBurgerTotal(burguer) 
{
  let total = 0;

  burguer.ingredients.forEach(ingredient => {
      total = total + Number(ingredient.price)
  });

  if (burguer.bread) {
    total = total + Number(burguer.bread.price);
  }

  return total;
}

export function calculateTraySubTotal(tray)
{
  let total = 0;

  tray.forEach(burguer => {

      total = total + calculateBurgerTotal(burguer);
  });

  return total;
}

export function showAlertError(message) 
{

  alert(message);
}

export function randomOrderNumber(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
}

export function loginUser(email, password)
{
  return firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {

      const { user } = response;

      if (user != null) {
        window.location.href = "index.html";
      }

    })
    .catch((err) => showAlertError('Usuário e/ou senha incorreto(s).'))
}