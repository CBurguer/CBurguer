export function getFormValues(form) {
  const values = {};

  form.querySelectorAll("[name]").forEach((input) => {
    values[input.name] = input.value;
  });

  return values;
}
