// Ajustements du flux de manche : chargé après app.js pour remplacer les anciens contrôles.
(function () {
  const $ = id => document.getElementById(id);

  // Durée de débogage : la première question est toujours limitée à 3 secondes.
  Object.values(questionSets).forEach(questions => {
    if (questions[0]) questions[0][1] = 3;
  });

  // L’écran de jeu n’a plus de sélecteur de classe : la classe est choisie avant l’entrée.
  const oldStartClass = $("start-class");
  const startClass = oldStartClass.cloneNode(true);
  oldStartClass.replaceWith(startClass);
  startClass.addEventListener("click", () => {
    const selected = document.querySelector('input[name="active-class"]:checked');
    if (!selected) return;
    state.activeClass = selected.value;
    state.current = state.teacher.classes.indexOf(state.activeClass);
    $("active-class-name").textContent = state.activeClass;
    const classIndex = classNames.indexOf(state.activeClass);
    $("active-class-pawn").textContent = classIndex + 1;
    $("active-class-pawn").style.background = classColors[classIndex];
    $("class-selection-screen").classList.add("is-hidden");
    $("game-screen").classList.remove("is-hidden");
    renderBoard();
    updateQuestion();
  });

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
  }

  function startDebugTimer() {
    clearInterval(state.timer);
    const question = questionSets[state.series][state.question];
    const seconds = state.question === 0 ? 3 : question[1];
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

  const launchButton = $("roll-dice");
  const freshLaunchButton = launchButton.cloneNode(true);
  launchButton.replaceWith(freshLaunchButton);
  freshLaunchButton.addEventListener("click", () => {
    if (state.challengeActive || state.moving) return;
    if (state.waitingNext) {
      state.question = (state.question + 1) % questionSets[state.series].length;
      state.waitingNext = false;
    }
    updateQuestion();
    resetQuestionView();
    $("question-modal").classList.remove("is-hidden");
    state.challengeActive = true;
    startDebugTimer();
  });

  const originalApply = applyAnswer;
  applyAnswer = function (correct) {
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
  };

  $("close-correction").addEventListener("click", async () => {
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
    state.waitingNext = true;
    freshLaunchButton.textContent = "➡️ Question suivante";
    $("move-message").textContent = "Le pion a joué. Lancez la question suivante.";
  });
})();
