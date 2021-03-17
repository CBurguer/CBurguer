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
    .catch((err) => showAlertError(err.message))
}