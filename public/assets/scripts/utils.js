export function getFormValues(form) {
    const values = {};

    form.querySelectorAll("[name]").forEach((input) => {
        values[input.name] = input.value;
    });

    return values;
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

    total = total + Number(burguer.bread.price);

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

export function formatCurrency(value) 
{
    // return parseFloat(value).toLocaleString('pt-br', {
    //     style: 'currency',
    //     currency: 'BRL'
    // });

    return Intl.NumberFormat('pt-br', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function showAlertError(message) {

    alert(message);
}