import ReactDOM from "react-dom";
import { useState } from "react";
import MathJax from "react-mathjax";
import * as _ from "lodash";

let initialConfiguration =
  [ { name: "Optellen tot 1000"
    , genXY: () => [randomInt(1, 999), randomInt(1, 999)]
    , operator: '+'
    , enabled: true
    }
  , { name: "Tafels tot en met 10"
    , genXY: () => [randomInt(1, 10), randomInt(1, 10)]
    , operator: '×'
    , enabled: true
    }
  , { name: "Aftrekken tot 1000"
    , genXY: () => {
        const x = randomInt(1, 999);
        const y = randomInt(1, x);
        return [x, y]
      }
    , operator: '-'
    , enabled: true
    }
  , { name: "Breuken optellen"
    , genXY: () => [randomFrac(2, 10), randomFrac(2, 10)]
    , operator: '+'
    , enabled: true
    }
  ]

document.addEventListener('DOMContentLoaded', () => {
  function generateNewProblem(configuration) {
    const conf = pick(configuration.filter(c => c.enabled));
    return generate(conf);
  }

  function Root() {
    const [result, setResult] = useState("");
    const [answer, setAnswer] = useState("");
    const [configuration, setConfiguration] = useState(initialConfiguration);
    const [problem, setProblem] = useState(generateNewProblem(configuration));
    const answered = result != "";

    function clearAndNew(conf) {
      setResult("");
      setAnswer("");
      setProblem(generateNewProblem(conf));
    }

    function check() {
      if (answered) {
        clearAndNew(configuration);
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
               <Som x={ problem.x } operator={ problem.operator } y={ problem.y } answer={ answer } setAnswer={ setAnswer } check={ check }/>
               <Controleren answered={ answered } check={ check } />
               <Resultaat result={ result } answer={ problem.answer }/>
               <Configuration configuration={ configuration } setConfiguration={ c => { clearAndNew(c); setConfiguration(c); } }/>
             </div>
           </MathJax.Provider>
  }

  function Som(props) {
    return <p id="som">
             <span id="number1"><MathJax.Node inline formula={showNum(props.x)} /></span>
             <span id="operator">{props.operator}</span>
             <span id="number2"><MathJax.Node inline formula={showNum(props.y)} /></span>
             <span>=</span>
             <Antwoord type={isFrac(props.x) ? "fraction" : "number"} answer={props.answer} setAnswer={props.setAnswer} check={ props.check }/>
           </p>
  }

  function Antwoord(props) {
    const answer = props.answer == "" ? { numerator: "", denominator: "" } : props.answer;
    return props.type == "fraction" ?
      <span id="antwoord-fraction">
        <input id="antwoord-teller" className="antwoord" size="6" type="number" value={answer.numerator} onChange={ e => props.setAnswer({ ...answer, numerator: e.target.value}) } onKeyPress={ e => { if (e.key == "Enter") { document.getElementById("antwoord-noemer").focus(); } } }/>
        <hr />
        <input id="antwoord-noemer" className="antwoord" size="6" type="number" value={answer.denominator} onChange={ e => props.setAnswer({ ...answer, denominator: e.target.value} ) } onKeyPress={ e => { if (e.key == "Enter") { props.check(); } } }/>
      </span>
      :
      <span><input id="antwoord" className="antwoord" size="6" type="number" value={props.answer} onChange={ e => props.setAnswer(e.target.value) } onKeyPress={ e => { if (e.key == "Enter") { props.check(); } } } /></span>
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

  function Configuration(props) {
    function onCheckChanged(e, conf) {
      conf.enabled = e.target.checked;
      if (props.configuration.some(c => c.enabled)) {
        props.setConfiguration(props.configuration.slice());
      } else {
        conf.enabled = true;
      }
    }

    return <div id="config-panel">
             <h2>Welke sommen wil je?</h2>
             <div id="configurations">
             { props.configuration.map((conf, i) =>
                 <div className="configuration" key={ conf.name }>
                   <div><input type="checkbox" checked={ conf.enabled } onChange={ e => onCheckChanged(e, conf) }/></div>
                   <div>{ conf.name }</div>
                 </div>)
             }
             </div>
           </div>
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
