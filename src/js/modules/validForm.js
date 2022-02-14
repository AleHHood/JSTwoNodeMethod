const validForm = (form, input = false) => {
  let x, num;

  x = form.value.length;
  x = x - 1;

  num = form.value;

  //Удаляем ноль из input
  if (/^[0]{1}[0-9]{1,4}?$/gm.test(form.value)) {
    form.value = num.slice(1, 2);
  }

  switch (input) {
    case false:
      //Фиксим баг с запятой (заменяем все запятые)
      form.value = form.value.replace(/,/g, ".");
      console.log(form.value);
      if (!/^[0-9]{1,3}([,.][0-9]{0,4})?$/gm.test(form.value)) {
        form.value = num.slice(0, x);
      }
      break;

    //Валидация для номера элемента
    case "inputN":
      if (!/^[0-9]{1,2}?$/gm.test(form.value)) {
        form.value = num.slice(0, x);
      }
      break;
  }
};

export default validForm;
