import { teachers, classNames, classColors, students, questionSets } from "./data.js";
import { $, animatePawn, isPrime, notify, renderBoard, renderClasses, updateQuestion } from "./view.js";

const state = {
  teacher: null,
  activeClass: null,
  current: 0,
  question: 0,
  series: "Série 1",
  timer: null,
  moving: false,
  challengeActive: false,
  correctAnswers: 0,
  waitingNext: false,
  finished: false,
  pendingAnswer: null,
  classes: Object.fromEntries(classNames.map((name, index) => [name, { pos: 0, rounds: 0, color: classColors[index] }]))
};

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function syncSeriesToActiveClass() {
  const seriesCount = Object.keys(questionSets).length;
  const rounds = state.classes[state.activeClass]?.rounds || 0;
  state.series = `Série ${(rounds % seriesCount) + 1}`;
  if ($("series-status")) $("series-status").textContent = state.series;
}

async function moveClass(name, steps) {
  if (state.moving || !state.teacher.classes.includes(name)) return;
  state.moving = true;
  const data = state.classes[name];
  const direction = Math.sign(steps);
  for (let index = 0; index < Math.abs(steps); index++) {
    const previous = data.pos;
    data.pos = Math.max(0, Math.min(223, data.pos + direction));
    animatePawn(state, name, previous);
    await sleep(470);
  }
  renderClasses(state);
  state.moving = false;
}

function setAnswerButtons(visible) {
  ["correct-answer", "wrong-answer"].forEach(id => $(id).classList.toggle("is-hidden", !visible));
}

function resetQuestionView() {
  $("stage-question").classList.remove("is-hidden");
  $("question-phase").classList.remove("is-hidden");
  $("draw-phase").classList.add("is-hidden");
  $("student-phase").classList.add("is-hidden");
  $("stage-correction").classList.add("is-hidden");
  $("close-correction").classList.add("is-hidden");
  setAnswerButtons(false);
  $("correct-answer").disabled = false;
  $("wrong-answer").disabled = false;
  $("timer-label").textContent = "À toi de réfléchir !";
}

function highlightPrimeStop(position) {
  const cell = document.querySelectorAll("#game-board .cell")[position];
  if (!cell) return;
  cell.classList.add("prime-stop");
  setTimeout(() => cell.classList.remove("prime-stop"), 1400);
}

function finishQuestionTimer() {
  $("stage-question").classList.add("is-hidden");
  $("question-phase").classList.add("is-hidden");
  $("timer-label").textContent = "Le temps est écoulé !";
  runStudentDraw();
}

function startTimer() {
  clearInterval(state.timer);
  const seconds = questionSets[state.series][state.question][1];
  let left = seconds;
  $("timer-value").textContent = left;
  $("timer-ring").style.setProperty("--progress", "100%");
  state.timer = setInterval(() => {
    left -= 1;
    $("timer-value").textContent = Math.max(0, left);
    $("timer-ring").style.setProperty("--progress", `${Math.max(0, left / seconds * 100)}%`);
    if (left <= 10) $("timer-ring").classList.add("urgent");
    if (left <= 0) {
      clearInterval(state.timer);
      finishQuestionTimer();
    }
  }, 1000);
}

function runStudentDraw() {
  const list = students[state.activeClass] || [];
  $("draw-phase").classList.remove("is-hidden");
  $("student-phase").classList.add("is-hidden");
  let count = 0;
  clearInterval(runStudentDraw.timer);
  runStudentDraw.timer = setInterval(() => {
    $("draw-animation-name").textContent = list[Math.floor(Math.random() * list.length)] || "…";
    if (++count >= 14) {
      clearInterval(runStudentDraw.timer);
      const chosen = list[Math.floor(Math.random() * list.length)] || "Élève";
      $("draw-phase").classList.add("is-hidden");
      $("student-phase").classList.remove("is-hidden");
      $("stage-student-name").textContent = chosen;
      setAnswerButtons(true);
    }
  }, 90);
}

function login() {
  const teacher = teachers[$("teacher-select").value];
  if (!teacher || $("password").value !== teacher.password) {
    notify("Identifiants incorrects");
    $("password").value = "";
    return;
  }
  state.teacher = teacher;
  state.activeClass = teacher.classes[0];
  state.current = 0;
  $("login-screen").classList.add("is-hidden");
  $("class-selection-screen").classList.remove("is-hidden");
  $("class-selection-intro").textContent = `${teacher.name}, choisissez la classe avec laquelle vous jouez aujourd’hui.`;
  $("owned-class-choices").innerHTML = teacher.classes.map((name, index) => `<label class="class-choice ${index === 0 ? "selected" : ""}"><input type="radio" name="active-class" value="${name}" ${index === 0 ? "checked" : ""}> <span>${name}</span></label>`).join("");
}

function enterSelectedClass() {
  const selected = document.querySelector('input[name="active-class"]:checked');
  if (!selected) return;
  state.activeClass = selected.value;
  state.current = state.teacher.classes.indexOf(state.activeClass);
  state.question = 0;
  state.waitingNext = false;
  state.finished = false;
  syncSeriesToActiveClass();
  $("class-selection-screen").classList.add("is-hidden");
  $("game-screen").classList.remove("is-hidden");
  renderBoard(state);
  updateQuestion(state, questionSets);
}

function launchQuestion() {
  if (state.finished) {
    clearInterval(state.timer);
    state.finished = false;
    state.challengeActive = false;
    $("question-modal").classList.add("is-hidden");
    $("game-screen").classList.add("is-hidden");
    $("class-selection-screen").classList.add("is-hidden");
    $("login-screen").classList.remove("is-hidden");
    $("roll-dice").textContent = "🎲 Lancer le jeu";
    return;
  }
  if (state.challengeActive || state.moving) return;
  syncSeriesToActiveClass();
  if (state.waitingNext) {
    state.question = (state.question + 1) % questionSets[state.series].length;
    state.waitingNext = false;
  }
  updateQuestion(state, questionSets);
  resetQuestionView();
  $("question-modal").classList.remove("is-hidden");
  state.challengeActive = true;
  startTimer();
}

function applyAnswer(correct) {
  if (state.moving || !state.challengeActive) return;
  clearInterval(state.timer);
  state.challengeActive = false;
  state.pendingAnswer = correct;
  $("correct-answer").disabled = true;
  $("wrong-answer").disabled = true;
  setAnswerButtons(false);
  $("stage-correction").classList.remove("is-hidden");
  $("close-correction").classList.remove("is-hidden");
  $("timer-label").textContent = correct
    ? "Bonne réponse : ferme la correction pour déplacer le pion."
    : "Réponse incorrecte : ferme la correction pour déplacer le pion.";
}

async function closeCorrection() {
  if (typeof state.pendingAnswer !== "boolean") return;
  const correct = state.pendingAnswer;
  state.pendingAnswer = null;
  const name = state.activeClass;
  let delta = correct ? 2 : -1;
  if (correct) state.correctAnswers += 1;
  else state.correctAnswers = 0;
  if (state.correctAnswers >= 5) {
    delta += 2;
    state.correctAnswers = 0;
    notify("Série de 5 bonnes réponses : bonus de 2 cases !");
  }
  $("question-modal").classList.add("is-hidden");
  await moveClass(name, delta);
  if (!correct && isPrime(state.classes[name].pos)) {
    highlightPrimeStop(state.classes[name].pos);
    notify("⏸️ Arrêt sur une case première ! Bonus de 2 cases !");
    await sleep(1200);
    await moveClass(name, 2);
  }
  const lastQuestion = state.question === questionSets[state.series].length - 1;
  if (lastQuestion) {
    state.classes[name].rounds += 1;
    syncSeriesToActiveClass();
    renderClasses(state);
    state.waitingNext = false;
    state.finished = true;
    $("roll-dice").textContent = "↩️ Quitter";
    $("move-message").textContent = `${name} a terminé sa série : tour ${state.classes[name].rounds}.`;
    notify("🏁 Les 5 questions sont terminées !");
  } else {
    state.waitingNext = true;
    $("roll-dice").textContent = "➡️ Question suivante";
    $("move-message").textContent = "Le pion a joué. Lancez la question suivante.";
  }
}

$("login-form").addEventListener("submit", event => { event.preventDefault(); login(); });
$("start-class").addEventListener("click", enterSelectedClass);
$("owned-class-choices").addEventListener("change", event => {
  document.querySelectorAll(".class-choice").forEach(label => label.classList.toggle("selected", label.contains(event.target)));
});
$("back-to-login").addEventListener("click", () => {
  $("class-selection-screen").classList.add("is-hidden");
  $("login-screen").classList.remove("is-hidden");
});
$("logout").addEventListener("click", () => {
  clearInterval(state.timer);
  state.challengeActive = false;
  $("game-screen").classList.add("is-hidden");
  $("class-selection-screen").classList.add("is-hidden");
  $("question-modal").classList.add("is-hidden");
  $("login-screen").classList.remove("is-hidden");
});
$("roll-dice").addEventListener("click", launchQuestion);
$("correct-answer").addEventListener("click", () => applyAnswer(true));
$("wrong-answer").addEventListener("click", () => applyAnswer(false));
$("close-correction").addEventListener("click", closeCorrection);
