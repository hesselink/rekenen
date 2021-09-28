let configurations =
  [ { lower: 1
    , upper: 999
    , operator: '+'
    }
  , { lower: 1
    , upper: 10
    , operator: '×'
    }
  ]
let answer;

document.addEventListener('DOMContentLoaded', () => {
  refresh();
  const controleren = document.getElementById("controleren");
  controleren.addEventListener("click", () => {
    const antwoord = document.getElementById("antwoord");
    if (antwoord.value == answer) {
      alert("Super de puper goed!");
    } else {
      alert("Niet helemaal, het antwoord was " + answer);
    }
    antwoord.value = "";
    refresh();
  });
});

function refresh() {
  const configuration = pick(configurations);
  const number1 = document.getElementById("number1");
  const number2 = document.getElementById("number2");
  const operator = document.getElementById("operator");
  const x = random(configuration.lower, configuration.upper);
  const y = random(configuration.lower, configuration.upper);
  number1.textContent = x;
  number2.textContent = y;
  operator.textContent = configuration.operator;
  answer = calculate(configuration.operator, x, y);
}

function pick(xs) {
  const ix = random(0, xs.length - 1);
  return xs[ix];
}

// random integer from 'from' to 'to' (inclusive, [from, to])
function random(from, to) {
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

function calculate(operator, x, y) {
  switch(operator) {
    case '+': return x + y;
    case '×': return x * y;
    case '-': return x - y;
  }
}
