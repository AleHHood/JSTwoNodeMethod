// ~ начала дроби
// tac добавляет class .tac данному p
// notice добавляет class notice

const getMath = (expression, appendBlock) => {
  function GetExpression(expression, appendBlock) {
    let split;

    const newBlock = document.createElement("p");

    // Если есть tac - добавляем class .tac
    if (expression.startsWith("tac")) {
      expression = expression.slice(4);
      newBlock.classList.add("tac");
    }

    // Если есть notice - добавляем class .notice
    if (expression.startsWith("notice")) {
      expression = expression.slice(7);
      newBlock.classList.add("notice");
    }

    split = expression.split("~");

    split.forEach((element) => {
      if (!GetFrac(element, newBlock)) {
        newBlock.innerHTML += element;
      }
      newBlock.innerHTML += " ";
    });
    newBlock.classList.add("Math");
    appendBlock.append(newBlock);
  }

  function GetFrac(expression, newBlock) {
    let split;
    split = expression.split("/");

    if (split.length == 2) {
      newBlock.innerHTML +=
        `<span class="fraction" ><span class="fraction__top">` +
        `${split[0]}` +
        `</span><span class="fraction__bottom">` +
        `${split[1]}</span></span>`;

      return true;
    }
    return false;
  }

  GetExpression(expression, appendBlock);
};

export default getMath;
