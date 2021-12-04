let configurations =
  [ { genXY: () => [randomInt(1, 999), randomInt(1, 999)]
    , operator: '+'
    }
  , { genXY: () => [randomInt(1, 10), randomInt(1, 10)]
    , operator: '×'
    }
  , { genXY: () => {
        const x = randomInt(1, 999);
        const y = randomInt(1, x);
        return [x, y]
      }
    , operator: '-'
    }
  ]
let answer;
let answered = false;

document.addEventListener('DOMContentLoaded', () => {
  refresh();
  const controleren = document.getElementById("controleren");
  controleren.addEventListener("click", () => {
    if (!answered) {
      const antwoord = document.getElementById("antwoord");
      const resultaat = document.getElementById("resultaat");
      if (antwoord.value == "") {
        return;
      }
      if (antwoord.value == answer) {
        resultaat.innerText = "Super de puper goed!";
        resultaat.className = "goed";
      } else {
        resultaat.innerText = "Niet helemaal, het antwoord was " + answer;
        resultaat.className = "fout";
      }
      answered = true;
      controleren.value = "Nieuwe som"
    } else {
      antwoord.value = "";
      resultaat.innerText = "";
      resultaat.className = "";
      answered = false;
      controleren.value = "Controleren"
      refresh();
    }
  });
});

function refresh() {
  const configuration = pick(configurations);
  const number1 = document.getElementById("number1");
  const number2 = document.getElementById("number2");
  const operator = document.getElementById("operator");
  const generated = generate(configuration);
  number1.innerHTML = showNum(generated.x);
  number2.innerHTML = showNum(generated.y);
  operator.textContent = generated.operator;
  answer = showNum(generated.answer);
}

function generate(configuration) {
  const [x, y] = configuration.genXY();
  const answer = calculate(configuration.operator, x, y);
  return { x, y, operator: configuration.operator, answer }
}

function pick(xs) {
  const ix = randomInt(0, xs.length - 1);
  return xs[ix];
}

// random integer from 'from' to 'to' (inclusive, [from, to])
function randomInt(from, to) {
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

function showNum(x) {
  return "" + x;
}

function calculate(operator, x, y) {
  switch(operator) {
    case '+': return x + y;
    case '×': return x * y;
    case '-': return x - y;
  }
}
