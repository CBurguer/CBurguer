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