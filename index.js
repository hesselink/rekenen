import ReactDOM from "react-dom";
import { useState } from "react";
import MathJax from "react-mathjax";
import * as _ from "lodash";

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
  , { genXY: () => [randomFrac(2, 10), randomFrac(2, 10)]
    , operator: '+'
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
        if (_.isEqual(problem.answer, parse(answer))) {
          setResult("goed");
        } else {
          setResult("fout");
        }
      }
    }

    return <MathJax.Provider>
             <div>
               <Som x={ problem.x } operator={ problem.operator } y={ problem.y } answer={ answer } setAnswer={ setAnswer }/>
               <Controleren answered={ answered } check={ check } />
               <Resultaat result={ result } answer={ problem.answer }/>
             </div>
           </MathJax.Provider>
  }

  function Som(props) {
    return <p id="som">
             <span id="number1"><MathJax.Node inline formula={showNum(props.x)} /></span>
             <span id="operator">{props.operator}</span>
             <span id="number2"><MathJax.Node inline formula={showNum(props.y)} /></span>
             <span>=</span>
             <Antwoord type={isFrac(props.x) ? "fraction" : "number"} answer={props.answer} setAnswer={props.setAnswer} />
           </p>
  }

  function Antwoord(props) {
    answer = props.answer == "" ? { numerator: "", denominator: "" } : props.answer;
    return props.type == "fraction" ?
      <span id="antwoord-fraction">
        <input id="antwoord-teller" className="antwoord" size="6" type="number" value={answer.numerator} onChange={ e => props.setAnswer({ ...answer, numerator: e.target.value}) }/>
        <hr />
        <input id="antwoord-noemer" className="antwoord" size="6" type="number" value={answer.denominator} onChange={ e => props.setAnswer({ ...answer, denominator: e.target.value} ) }/>
      </span>
      :
      <span><input id="antwoord" className="antwoord" size="6" type="number" value={props.answer} onChange={ e => props.setAnswer(e.target.value) }/></span>
  }

  function Controleren(props) {
    return <p>
             <input id="controleren" type="submit" value={ props.answered ? "Nieuwe som" : "Controleren" } onClick={props.check}/>
           </p>
  }

  function Resultaat(props) {
    return <p id="resultaat" className={ props.result }>
           {
             props.result == "" ? "" :
             props.result == "goed" ? "Super de puper goed!" :
             <span>Niet helemaal, het antwoord was <MathJax.Node inline formula={ showNum(props.answer) } /></span>
           }
           </p>
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

function randomFrac(fromD, toD) {
  const denominator = randomInt(fromD, toD);
  const numerator = randomInt(1, denominator - 1);
  return { numerator, denominator };
}

function addFracs(x, y) {
  const newNumerator = x.numerator * y.denominator + y.numerator * x.denominator;
  return simplifyFrac({ numerator: newNumerator, denominator: x.denominator * y.denominator });
}

function simplifyFrac(x) {
  const fracGcd = gcd(x.numerator, x.denominator);
  return { numerator: x.numerator / fracGcd, denominator: x.denominator / fracGcd }
}

function gcd(x, y) {
  const a = Math.max(x, y);
  const b = Math.min(x, y);
  const rem = a % b;
  return rem === 0 ? b : gcd(b, rem)
}

function showFrac(x) {
  return `\\frac{${x.numerator}}{${x.denominator}}`;
}

function isFrac(x) {
  return !!x.denominator;
}

function showNum(x) {
  return isFrac(x) ? showFrac(x) : "" + x;
}

function parse(x) {
  return isFrac(x) ? parseFrac(x) : parseInt(x);
}

function parseFrac(x) {
  return { numerator: parseInt(x.numerator), denominator: parseInt(x.denominator) };
}

function calculate(operator, x, y) {
  switch(operator) {
    case '+': return isFrac(x) ? addFracs(x, y) : x + y;
    case '×': return x * y;
    case '-': return x - y;
  }
}
