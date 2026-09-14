import { DEBUG_ENABLED, teachers, classNames, classColors, classCatalog, classProgression, students, labels, updateClassProgression } from "./data.js";
import { $, animatePawn, isPrime, notify, renderBoard, renderClasses, updateQuestion } from "./view.js";
import { authenticateTeacher, loadDebugPassword, loadGameSnapshot, recordAnswer, saveGameState } from "./api.js";
import { playCoin, playCheer, playEncourage, playFootstep } from "./sounds.js";
import { startHaunting, summonCheer, summonComfort } from "./spirits.js";

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
  remoteSyncTimer: null,
  syncRevision: 0,
  debug: DEBUG_ENABLED && new URLSearchParams(window.location.search).get("debug") === "1",
  classes: Object.fromEntries(classNames.map((name, index) => [name, {
    pos: classProgression[name].position,
    rounds: classProgression[name].rounds,
    nextQuestion: 0,
    color: classColors[index]
  }]))
};

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const initialLoadStartedAt = performance.now();
let questionSets = {};

function selectedTeacherId() { return $("teacher-select").value; }

async function persistClassState(name, event = null) {
  try {
    const snapshot = await saveGameState(name, state.classes[name], event);
    if (snapshot.correction !== undefined) $("correction-text").textContent = snapshot.correction;
    applyRemoteSnapshot(snapshot, false);
    return true;
  } catch (error) {
    console.warn("Synchronisation indisponible, fonctionnement local conservé.", error);
    return false;
  }
}

function applyRemoteSnapshot(snapshot, animateChanges = true) {
  if (!snapshot?.classes) return;
  if (snapshot.content) {
    Object.keys(teachers).forEach(key => delete teachers[key]);
    Object.assign(teachers, snapshot.content.teachers || {});
    const previousSelection = $("teacher-select").value;
    $("teacher-select").innerHTML = Object.entries(teachers).map(([key, teacher]) => `<option value="${key}">${teacher.name}</option>`).join("");
    $("teacher-select").value = teachers[previousSelection] ? previousSelection : Object.keys(teachers)[0] || "";
    $("teacher-select").disabled = false;
    $("login-submit").disabled = false;
    Object.keys(students).forEach(key => delete students[key]);
    Object.assign(students, snapshot.content.students || {});
    Object.keys(questionSets).forEach(key => delete questionSets[key]);
    Object.assign(questionSets, snapshot.content.question_sets || {});
    labels.splice(0, labels.length, ...(snapshot.content.labels || []));
    const remoteCatalog = snapshot.content.class_catalog || [];
    classNames.splice(0, classNames.length, ...remoteCatalog.map(item => item.name));
    classColors.splice(0, classColors.length, ...remoteCatalog.map(item => item.color));
    classCatalog.splice(0, classCatalog.length, ...remoteCatalog);
    $("teacher-select").dispatchEvent(new Event("change"));
  }
  snapshot.classes.forEach(remoteClass => {
    if (!state.classes[remoteClass.class_name]) {
      const classIndex = classNames.indexOf(remoteClass.class_name);
      state.classes[remoteClass.class_name] = {
        pos: remoteClass.position,
        rounds: remoteClass.rounds,
        nextQuestion: remoteClass.next_question || 0,
        color: classColors[classIndex] || "#9766bc"
      };
    }
    const localClass = state.classes[remoteClass.class_name];
    const previousPosition = localClass.pos;
    localClass.color = classColors[classNames.indexOf(remoteClass.class_name)] || localClass.color;
    localClass.pos = remoteClass.position;
    localClass.rounds = remoteClass.rounds;
    localClass.nextQuestion = remoteClass.next_question || 0;
    updateClassProgression(remoteClass.class_name, { position: remoteClass.position, rounds: remoteClass.rounds });
    if (animateChanges && !state.moving && previousPosition !== localClass.pos) {
      animatePawn(state, remoteClass.class_name, previousPosition);
    }
  });
  Object.keys(state.classes).forEach(name => {
    if (!classNames.includes(name)) delete state.classes[name];
  });
  syncSeriesToActiveClass();
  renderClasses(state);
}

async function synchronizeGameState(animateChanges = true) {
  const revision = state.syncRevision;
  try {
    const snapshot = await loadGameSnapshot();
    // Une réponse lancée juste avant un déplacement ne doit pas rétablir
    // l'ancienne position pendant l'animation.
    if (!state.moving && revision === state.syncRevision) applyRemoteSnapshot(snapshot, animateChanges);
    return true;
  } catch (error) {
    // Le jeu reste utilisable hors ligne ; la prochaine tentative reprendra automatiquement.
    console.warn("Base de données indisponible, fonctionnement local conservé.", error);
    return false;
  }
}

function startRemoteSync() {
  clearInterval(state.remoteSyncTimer);
  state.remoteSyncTimer = setInterval(() => {
    if (!state.moving) synchronizeGameState(true);
  }, 2000);
}

function syncSeriesToActiveClass() {
  const seriesCount = Object.keys(questionSets).length;
  const rounds = state.classes[state.activeClass]?.rounds || 0;
  const nextSeries = `Série ${(rounds % seriesCount) + 1}`;
  if (state.series !== nextSeries) state.question = 0;
  state.series = nextSeries;
  if ($("series-status")) {
    const totalQuestions = questionSets[state.series]?.length || 5;
    $("series-status").textContent = `Série en cours : ${state.series} · prochaine question : ${state.question + 1}/${totalQuestions} · série : ${rounds}`;
  }
}

async function moveClass(name, steps) {
  if (state.moving || !state.teacher.classes.includes(name)) return;
  state.moving = true;
  state.syncRevision += 1;
  const data = state.classes[name];
  const direction = Math.sign(steps);
  for (let index = 0; index < Math.abs(steps); index++) {
    const previous = data.pos;
    data.pos = Math.max(0, Math.min(223, data.pos + direction));
    updateClassProgression(name, { position: data.pos });
    playFootstep();
    animatePawn(state, name, previous);
    await sleep(470);
  }
  renderClasses(state);
  await persistClassState(name);
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
  setTimeout(() => cell.classList.remove("prime-stop"), 1800);
}

function finishQuestionTimer() {
  $("stage-question").classList.add("is-hidden");
  $("question-phase").classList.add("is-hidden");
  $("timer-label").textContent = "Le temps est écoulé !";
  runStudentDraw();
}

function startTimer() {
  clearInterval(state.timer);
  const seconds = state.debug ? 3 : questionSets[state.series][state.question][1];
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

async function login() {
  if (!Object.keys(teachers).length) await synchronizeGameState(false);
  const loadingStartedAt = performance.now();
  $("login-validation-screen").classList.remove("is-hidden");
  const result = await authenticateTeacher(selectedTeacherId(), $("password").value).catch(() => null);
  await sleep(Math.max(0, 450 - (performance.now() - loadingStartedAt)));
  $("login-validation-screen").classList.add("is-hidden");
  const teacher = result?.teacher;
  if (!teacher) {
    notify("Identifiants incorrects");
    $("password").value = "";
    return;
  }
  state.teacher = teacher;
  state.activeClass = teacher.classes[0];
  state.current = 0;
  $("login-screen").classList.add("is-hidden");
  if (teacher.classes.length === 1) {
    await enterSelectedClass(teacher.classes[0]);
    return;
  }
  $("class-selection-screen").classList.remove("is-hidden");
  $("class-selection-intro").textContent = `${teacher.name}, choisissez la classe avec laquelle vous jouez aujourd’hui.`;
  $("owned-class-choices").innerHTML = teacher.classes.map((name, index) => `<label class="class-choice ${index === 0 ? "selected" : ""}"><input type="radio" name="active-class" value="${name}" ${index === 0 ? "checked" : ""}> <span>${name}</span></label>`).join("");
  requestAnimationFrame(() => document.querySelector('input[name="active-class"]:checked')?.focus());
}

async function enterSelectedClass(className = null) {
  const selected = className ? null : document.querySelector('input[name="active-class"]:checked');
  const selectedClass = className || selected?.value;
  if (!selectedClass) return;
  state.activeClass = selectedClass;
  state.current = state.teacher.classes.indexOf(state.activeClass);
  state.question = 0;
  state.waitingNext = false;
  state.finished = false;
  $("class-selection-screen").classList.add("is-hidden");
  $("board-loading-screen").classList.remove("is-hidden");
  const boardLoadingStartedAt = performance.now();
  await synchronizeGameState(false);
  syncSeriesToActiveClass();
  state.question = state.classes[state.activeClass]?.nextQuestion || 0;
  syncSeriesToActiveClass();
  renderBoard(state);
  updateQuestion(state, questionSets);
  await sleep(Math.max(0, 450 - (performance.now() - boardLoadingStartedAt)));
  $("board-loading-screen").classList.add("is-hidden");
  $("game-screen").classList.remove("is-hidden");
  startRemoteSync();
  startHaunting();
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
  syncSeriesToActiveClass();
  updateQuestion(state, questionSets);
  resetQuestionView();
  $("question-modal").classList.remove("is-hidden");
  state.challengeActive = true;
  startTimer();
}

async function applyAnswer(correct) {
  if (state.moving || !state.challengeActive) return;
  clearInterval(state.timer);
  state.challengeActive = false;
  state.pendingAnswer = correct;
  state.classes[state.activeClass].nextQuestion = (state.question + 1) % questionSets[state.series].length;
  $("correct-answer").disabled = true;
  $("wrong-answer").disabled = true;
  setAnswerButtons(false);
  $("correction-text").textContent = questionSets[state.series][state.question][2] || "Correction indisponible.";
  $("stage-correction").classList.remove("is-hidden");
  $("close-correction").classList.remove("is-hidden");
  $("close-correction").disabled = true;
  $("timer-label").textContent = "Enregistrement de la réponse…";
  try {
    const result = await recordAnswer(state.activeClass, state.series, state.question, correct);
    if (result.correction !== undefined) $("correction-text").textContent = result.correction;
    if (Number.isInteger(result.nextQuestion)) state.classes[state.activeClass].nextQuestion = result.nextQuestion;
  } catch (error) {
    console.warn("Enregistrement de la réponse indisponible.", error);
    notify("La réponse n’a pas pu être sauvegardée : vérifiez la connexion.");
  }
  $("close-correction").disabled = false;
  $("timer-label").textContent = correct
    ? "Bonne réponse : ferme la correction pour déplacer le pion."
    : "Réponse incorrecte : ferme la correction pour déplacer le pion.";
  if (correct) {
    playCheer();
    summonCheer();
  } else {
    playEncourage();
    summonComfort();
  }
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
  if (state.classes[name].pos < 223 && isPrime(state.classes[name].pos)) {
    highlightPrimeStop(state.classes[name].pos);
    playCoin();
    notify("⏸️ Arrêt sur une case première ! Bonus de 3 cases !");
    await sleep(1200);
    await moveClass(name, 3);
  }
  const lastQuestion = state.question === questionSets[state.series].length - 1;
  if (lastQuestion) {
    state.classes[name].rounds += 1;
    updateClassProgression(name, { rounds: state.classes[name].rounds });
    const saved = await persistClassState(name);
    if (!saved) notify("La série n’a pas pu être sauvegardée : vérifiez la connexion.");
    syncSeriesToActiveClass();
    renderClasses(state);
    state.waitingNext = false;
    state.finished = true;
    $("roll-dice").textContent = "↩️ Quitter";
    $("move-message").textContent = `${name} a terminé sa série de questions n°${state.classes[name].rounds}.`;
    notify("🏁 Les 5 questions sont terminées !");
  } else {
    state.question = state.classes[name].nextQuestion;
    state.waitingNext = false;
    syncSeriesToActiveClass();
    $("roll-dice").textContent = "➡️ Question suivante";
    $("move-message").textContent = "Le pion a joué. Lancez la question suivante.";
  }
}

$("login-form").addEventListener("submit", event => { event.preventDefault(); login(); });
$("class-selection-form").addEventListener("submit", event => {
  event.preventDefault();
  enterSelectedClass();
});
$("teacher-select").addEventListener("change", () => {
  if (state.debug) loadDebugPassword(selectedTeacherId()).then(result => { $("password").value = result.password; }).catch(() => {});
});
document.addEventListener("keydown", event => {
  if (event.key !== "Enter" || $("class-selection-screen").classList.contains("is-hidden")) return;
  event.preventDefault();
  enterSelectedClass();
});
$("owned-class-choices").addEventListener("change", event => {
  document.querySelectorAll(".class-choice").forEach(label => label.classList.toggle("selected", label.contains(event.target)));
});
$("back-to-login").addEventListener("click", () => {
  $("class-selection-screen").classList.add("is-hidden");
  $("login-screen").classList.remove("is-hidden");
});
$("logout").addEventListener("click", () => {
  clearInterval(state.timer);
  clearInterval(state.remoteSyncTimer);
  state.challengeActive = false;
  $("game-screen").classList.add("is-hidden");
  $("class-selection-screen").classList.add("is-hidden");
  $("question-modal").classList.add("is-hidden");
  $("login-screen").classList.remove("is-hidden");
});
$("roll-dice").addEventListener("click", launchQuestion);
$("correct-answer").addEventListener("click", () => void applyAnswer(true));
$("wrong-answer").addEventListener("click", () => void applyAnswer(false));
$("close-correction").addEventListener("click", closeCorrection);
void synchronizeGameState(false).then(async loaded => {
  if (!loaded) return;
  await sleep(Math.max(0, 500 - (performance.now() - initialLoadStartedAt)));
  $("teachers-loading").classList.add("is-hidden");
  $("login-loading-overlay").classList.add("is-hidden");
  if (state.debug) loadDebugPassword(selectedTeacherId()).then(result => { $("password").value = result.password; }).catch(() => {});
});
