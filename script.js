const texts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the alphabet and is often used for typing practice.",

  "JavaScript is a versatile programming language that powers the dynamic behavior on most websites. It allows developers to create interactive user experiences.",

  "Typing tests are a useful way to measure and improve your typing speed and accuracy. Practicing regularly can help build muscle memory and increase confidence.",

  "Frontend development involves HTML for structure, CSS for styling, and JavaScript for behavior. Mastering these technologies is essential for building modern web interfaces.",

  "React is a powerful JavaScript library for building user interfaces. It uses components, hooks, and a virtual DOM to create fast and responsive applications with clean architecture.",

  "Consistent typing practice can significantly improve your productivity and efficiency, whether you're coding, writing reports, or communicating via email. Accuracy matters just as much as speed.",

  "Learning to type without looking at the keyboard, also known as touch typing, helps you focus more on the content of what you're writing and less on the act of typing itself.",
];

let currentText = "";
let timer = 60;
let timerInterval;
let started = false;
let history = [];

const target = document.getElementById("target-text");
const input = document.getElementById("input-box");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const historyList = document.getElementById("history");

function setNewText() {
  currentText = texts[Math.floor(Math.random() * texts.length)];
  renderText();
  input.value = "";
  input.disabled = false;
  timer = 60;
  timerDisplay.textContent = timer;
  started = false;
  clearInterval(timerInterval);
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;
}

function renderText() {
  target.innerHTML = "";
  currentText.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    target.appendChild(span);
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer === 0) {
      clearInterval(timerInterval);
      input.disabled = true;
      saveResult();
    }
  }, 1000);
}

function updateTextHighlight() {
  const inputText = input.value;
  const spans = target.querySelectorAll("span");

  inputText.split("").forEach((char, i) => {
    spans[i].className = char === currentText[i] ? "correct" : "incorrect";
  });

  for (let i = inputText.length; i < spans.length; i++) {
    spans[i].className = "";
  }
}

function calculateWPM() {
  const words = input.value.trim().split(" ").length;
  return Math.round((words / (60 - timer)) * 60);
}

function calculateAccuracy() {
  let correct = 0;
  const inputText = input.value;
  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] === currentText[i]) correct++;
  }
  return inputText.length ? Math.round((correct / inputText.length) * 100) : 0;
}

function saveResult() {
  const result = {
    date: new Date().toLocaleString(),
    wpm: calculateWPM(),
    accuracy: calculateAccuracy(),
  };
  history.unshift(result);
  if (history.length > 5) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.wpm} WPM, ${entry.accuracy}% Accuracy`;
    historyList.appendChild(li);
  });
}

input.addEventListener("input", () => {
  if (!started) {
    started = true;
    startTimer();
  }
  updateTextHighlight();
  wpmDisplay.textContent = calculateWPM();
  accuracyDisplay.textContent = calculateAccuracy();
});

document.getElementById("restart").addEventListener("click", setNewText);

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

setNewText();
