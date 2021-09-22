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
  const number1 = document.getElementById("number1");
  const number2 = document.getElementById("number2");
  const x = Math.floor(Math.random() * 1000);
  const y = Math.floor(Math.random() * 1000);
  number1.textContent = x;
  number2.textContent = y;
  answer = x + y
}
