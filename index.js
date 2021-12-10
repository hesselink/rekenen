import ReactDOM from "react-dom";
import { useState } from "react";

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

document.addEventListener('DOMContentLoaded', () => {
  function generateNewProblem() {
    const configuration = pick(configurations);
    return generate(configuration);
  }

  function Root() {
    const [result, setResult] = useState("");
    const [answer, setAnswer] = useState("");
    const [problem, setProblem] = useState(generateNewProblem());
    const answered = result != "";

    function check() {
      if (answered) {
        setResult("");
        setAnswer("");
        setProblem(generateNewProblem());
      } else {
        if (answer == "") {
          return;
        }
        if (showNum(problem.answer) == answer) {
          setResult("goed");
        } else {
          setResult("fout");
        }
      }
    }

    return <div>
             <Som x={ problem.x } operator={ problem.operator } y={ problem.y } answer={ answer } setAnswer={ setAnswer }/>
             <Controleren answered={ answered } check={ check } />
             <Resultaat result={ result } answer={ problem.answer }/>
           </div>
  }

  function Som(props) {
    return <p>
             <span id="number1">{props.x} </span>
             <span id="operator">{props.operator} </span>
             <span id="number2">{props.y} </span>
             <span>= </span>
             <input id="antwoord" size="6" type="number" value={props.answer} onChange={ e => props.setAnswer(e.target.value) }/>
           </p>
  }

  function Controleren(props) {
    return <p>
             <input id="controleren" type="submit" value={ props.answered ? "Nieuwe som" : "Controleren" } onClick={props.check}/>
           </p>
  }

  function Resultaat(props) {
    const text = props.result == "" ? "" :
                 props.result == "goed" ? "Super de puper goed!" :
                 "Niet helemaal, het antwoord was " + props.answer;
    return <p id="resultaat" className={ props.result }>{ text }</p>
  }

  const rootContainer = document.getElementById("root-container");
  ReactDOM.render(<Root/>, rootContainer);
});


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
