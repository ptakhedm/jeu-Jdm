const PASSWORD_PROF = "maths2026";

const questionsDatabase = {
  "Série 1": [
    ["9 × 8 = ?", 30, "9 × 8 = 72."],
    ["15 000 ÷ 100 = ?", 45, "15 000 ÷ 100 = 150."],
    ["729 − 177 = ?", 60, "729 − 177 = 552."],
    ["2 min 29 s = … s", 45, "2 × 60 + 29 = 149 secondes."],
    ["10 km = … m", 45, "10 km = 10 000 m."]
  ],
  "Série 2": [
    ["247 − 139 = ?", 45, "247 − 139 = 108."],
    ["4 h 38 min = … min", 60, "4 × 60 + 38 = 278 minutes."],
    ["Quel est le rang du chiffre 7 dans 234 78905 ?", 30, "7 est le chiffre des dizaines de milliers."],
    ["8 dag = … mg", 45, "8 dag = 80 000 mg."],
    ["Combien y a-t-il de centaines de milliers dans 4 367 987 ?", 45, "Le nombre possède 43 centaines de milliers."]
  ],
  "Série 3": [
    ["15 × 8 = ?", 45, "15 × 8 = 120."],
    ["Combien y a-t-il d’unités de milliers dans 4 367 987 ?", 45, "Il y a 4 367 unités de milliers."],
    ["12 min 5 s = … secondes", 60, "12 × 60 + 5 = 725 secondes."],
    ["Quel est le rang du chiffre 3 dans 23 478 905 ?", 30, "3 est le chiffre des unités de millions."],
    ["De 13 h 15 à 13 h 51, combien de temps s’est-il écoulé ?", 45, "Le trajet a duré 36 minutes."]
  ],
  "Série 4": [
    ["17 × 9 = ?", 45, "17 × 9 = 153."],
    ["12 roses coûtent 30 €. Combien coûtent 18 roses ?", 45, "Une rose coûte 2,50 €, donc 18 roses coûtent 45 €."],
    ["Combien d’heures dans 3 jours et 13 heures ?", 60, "3 × 24 + 13 = 85 heures."],
    ["31 cg = … g", 45, "31 cg = 0,31 g."],
    ["De 13 h 07 à 13 h 55, combien de temps ?", 60, "Le trajet a duré 48 minutes."]
  ],
  "Série 5": [
    ["Quelle est la moitié de 126 ?", 30, "126 ÷ 2 = 63."],
    ["5 glaces coûtent 15 €. Combien coûte une glace ?", 45, "15 ÷ 5 = 3 €."],
    ["Quelle fraction du carré est représentée par la partie grisée ?", 30, "Lire la fraction en comptant les parts égales : 3/8 dans le support."],
    ["Combien de secondes dans 4 min 33 s ?", 60, "4 × 60 + 33 = 273 secondes."],
    ["Calcule 23 × 3 − 27 + 3.", 45, "23 × 3 = 69, 69 − 27 = 42, 42 + 3 = 45."]
  ],
  "Série 6": [
    ["61,4 cm = … m", 30, "61,4 cm = 0,614 m."],
    ["De 13 h 21 à 14 h 09, combien de temps ?", 60, "Le trajet a duré 48 minutes."],
    ["9 × 7 − 25 = ?", 45, "63 − 25 = 38."],
    ["Combien d’heures dans 3 jours et 7 heures ?", 45, "3 × 24 + 7 = 79 heures."],
    ["Quelle fraction du carré est coloriée ?", 45, "Compter les parts égales et les parts coloriées sur la figure du support."]
  ],
  "Série 7": [
    ["Inès a 12 cartes, 4 fois plus que Léo. Combien Léo en a-t-il ?", 45, "12 ÷ 4 = 3 cartes."],
    ["11 × 9 − 31 = ?", 45, "99 − 31 = 68."],
    ["0,5 L = … mL", 45, "0,5 L = 500 mL."],
    ["Calcule 23 × 3 − 27 + 3.", 60, "23 × 3 = 69, 69 − 27 = 42, 42 + 3 = 45."],
    ["Quel est le résultat de 11 × 7 − 18 + 2 ?", 60, "77 − 18 + 2 = 61."]
  ],
  "Série 8": [
    ["Yacine mesure 1,52 m, soit 13 cm de plus que Pierre. Taille de Pierre ?", 45, "1,52 m − 0,13 m = 1,39 m."],
    ["12 pains au chocolat coûtent 15 €. Combien coûtent 18 pains ?", 60, "15 € + 7,50 € = 22,50 €."],
    ["Un train part à 10 h 49, trajet de 1 h 13. Arrivée ?", 45, "Le train arrive à 12 h 02."],
    ["100 − ? = 71", 45, "100 − 29 = 71."],
    ["Calcule 14 × 4 − 19 + 2 × 4.", 60, "56 − 19 + 8 = 45."]
  ],
  "Série 9": [
    ["Combien de minutes représentent le quart de 2 heures ?", 45, "120 ÷ 4 = 30 minutes."],
    ["Combien de carrés composent le motif n°5 ?", 60, "Le support indique 21 carrés."],
    ["35 billes sont partagées entre 3 élèves. Combien chacun ?", 60, "11 billes chacun et il reste 2 billes."],
    ["De 13 h 41 à 15 h 17, quelle est la durée ?", 45, "1 h 36 minutes."],
    ["Calcule 11 × 7 − 18 + 2.", 60, "77 − 18 + 2 = 61."]
  ],
  "Série 10": [
    ["Combien de minutes représentent les trois quarts de 3 heures ?", 45, "3 × 60 × 3/4 = 135 minutes, soit 2 h 15."],
    ["262 − ? = 87", 45, "262 − 175 = 87."],
    ["49 billes sont partagées entre 5 élèves. Combien en reste-t-il ?", 60, "5 × 9 = 45, il reste 4 billes."],
    ["Quelle fraction de la figure est grisée ?", 30, "La fraction correspond à 3/8."],
    ["Calcule : (27 ÷ 9 + 18) × 2.", 60, "27 ÷ 9 = 3 ; 3 + 18 = 21 ; 21 × 2 = 42."]
  ],
  "Série 11": [
    ["9 × 9 − 15 = ?", 45, "81 − 15 = 66."],
    ["3 jours et 9 heures = … heures", 60, "3 × 24 + 9 = 81 heures."],
    ["Triangle dont les trois côtés sont de même mesure ?", 30, "Un triangle équilatéral."],
    ["Combien de fois 7 dans 420 ?", 60, "7 × 60 = 420 : il y a 60 fois 7."],
    ["50 € moins la moitié de la moitié : combien reste-t-il ?", 60, "La dépense est 12,50 €, il reste 37,50 €."]
  ]
};

const students = {
  "6ème A": ["Lucas", "Chloé", "Nathan", "Inès", "Thomas", "Manon", "Gabriel", "Sarah", "Hugo", "Jade"],
  "6ème B": ["Louis", "Louise", "Jules", "Alice", "Adam", "Lina", "Enzo", "Mila", "Raphaël", "Rose"],
  "6ème C": ["Arthur", "Emma", "Noah", "Léa", "Sacha", "Zoé", "Lucas", "Manon", "Ethan", "Chloé"],
  "6ème D": ["Léonie", "Timéo", "Agathe", "Tom", "Louise", "Léon", "Camille", "Nathan", "Juliette", "Paul"]
};

const squareLabels = [
  "DÉPART · Al-Khawarizmi", "Euclide · nombres premiers", "Pythagore · théorème", "Descartes · repère", "Galois · groupes", "PONT · avance à 12", "Riemann · géométrie", "Fibonacci · suite", "Al-Karaji · algèbre", "Thalès · proportion", "Hypatie · astronomie", "Fibonacci · suite", "Fermat · nombres", "Leibniz · calcul", "Pascal · triangle", "Desargues · perspective", "Gauss · somme", "Euler · graphe", "HÔTEL · pause", "Turing · logique", "Boole · logique", "Cantor · infini", "Lagrange · fonctions", "Poisson · probabilités", "Laplace · hasard", "Fourier · signaux", "Cardan · équations", "Archimède · aire", "Ératosthène · crible", "Diophante · équations", "PUITS · retour 30", "Napier · logarithmes", "Brahmagupta · zéro", "Bhaskara · équations", "Aryabhata · calcul", "Zu Chongzhi · π", "Héron · aire", "Ménélaüs · géométrie", "Ptolémée · cercle", "Apollonius · coniques", "Eudoxe · proportions", "LABYRINTHE · retour 30", "Zénon · paradoxe", "Hippias · courbes", "Anaxagore · figures", "Platon · solides", "Aristote · logique", "PRISON · passe un tour", "Bachet · récréations", "Roberval · tangentes", "Mersenne · nombres", "Torricelli · volume", "Viviani · théorème", "TÊTE DE MORT · retour 0", "Cavalieri · indivisibles", "Newton · calcul", "Stokes · flux", "Green · champ", "Hamilton · chemins", "Galilée · mesure", "Copernic · modèle", "Kepler · orbites", "Poincaré · topologie", "Hilbert · problèmes", "Noether · symétries", "Kowalevskaia · analyse", "Germain · théorie", "Lovelace · algorithme", "Ramanujan · séries", "Cauchy · limites", "Lagrange · mécanique", "PALAIS DES MATHÉMATIQUES"
];

const state = {
  currentSeries: "Série 10", questionIndex: 0, timer: null, timeLeft: 0,
  positions: Object.fromEntries([1, 2, 3, 4, 5, 6].map(i => [`Équipe ${i}`, 0]))
};

const $ = id => document.getElementById(id);
function notify(message, type = "info") { const node = $("toast"); node.textContent = message; node.className = `toast ${type}`; node.classList.remove("hidden"); clearTimeout(notify.timeout); notify.timeout = setTimeout(() => node.classList.add("hidden"), 3500); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#039;"}[char])); }

function makeSpiralCoordinates() {
  const coordinates = [];
  const add = (r, c) => coordinates.push({ r, c });
  for (let c = 0; c < 9; c++) add(0, c);
  for (let r = 1; r < 9; r++) add(r, 8);
  for (let c = 7; c >= 0; c--) add(8, c);
  for (let r = 7; r >= 1; r--) add(r, 0);
  for (let c = 1; c < 8; c++) add(1, c);
  for (let r = 2; r < 8; r++) add(r, 7);
  for (let c = 6; c >= 1; c--) add(7, c);
  for (let r = 6; r >= 2; r--) add(r, 1);
  for (let c = 2; c < 7; c++) add(2, c);
  for (let r = 3; r < 7; r++) add(r, 6);
  for (let c = 5; c >= 2; c--) add(6, c);
  for (let r = 5; r >= 3; r--) add(r, 2);
  for (let c = 3; c < 6; c++) add(3, c);
  add(4, 5); add(5, 5);
  return coordinates;
}
function squareType(index) { if (index === 0) return "depart"; if (index === 71) return "arrivee"; if ([30, 41, 53].includes(index)) return "piege"; if ([5, 18, 47].includes(index)) return "special"; return ""; }
function renderBoard() {
  const board = $("board"); board.innerHTML = ""; const coordinates = makeSpiralCoordinates();
  for (let i = 0; i < 72; i++) {
    const position = coordinates[i]; const type = squareType(i); const pawns = Object.entries(state.positions).filter(([, pos]) => pos === i).map(([team]) => `<span class="pawn team-${team.slice(-1)}">${team.slice(-1)}</span>`).join("");
    const cell = document.createElement("div"); cell.className = `space ${type}`; cell.style.gridRow = position.r + 1; cell.style.gridColumn = position.c + 1; cell.title = `Case ${i} : ${squareLabels[i]}`;
    cell.innerHTML = `<span class="number">${i === 0 ? "DÉPART" : i}</span><span class="label">${escapeHtml(squareLabels[i])}</span><span class="pawns">${pawns}</span>`; board.appendChild(cell);
  }
  const center = document.createElement("div"); center.className = "center"; center.style.gridColumn = "3 / 8"; center.style.gridRow = "3 / 8"; center.innerHTML = `<strong>✦ Palais des Mathématiques ✦</strong><span>Répondre juste pour avancer<br>Attention aux pièges du parcours !</span>`; board.appendChild(center);
  renderTeams();
}
function renderTeams() {
  $("team-dashboard").innerHTML = Object.entries(state.positions).map(([team, position]) => `<div class="team-row"><span class="pawn team-${team.slice(-1)}">${team.slice(-1)}</span><span class="team-name">${team}<br><small>Case ${position}</small></span><span class="progress"><i style="width:${Math.round(position / 71 * 100)}%"></i></span><button class="btn green" data-team="${team}" data-move="-1">−</button><button class="btn blue" data-team="${team}" data-move="1">+</button><button class="btn gold" data-team="${team}" data-move="2">+2</button></div>`).join("");
}
function moveTeam(team, delta) { let next = state.positions[team] + delta; if (next === 5) { next = 12; notify(`${team} franchit le Pont et avance à la case 12.`, "success"); } if (next === 41) { next = 30; notify(`${team} tombe dans le Labyrinthe et revient à la case 30.`, "error"); } if (next === 53) { next = 0; notify(`${team} tombe sur la Tête de mort et revient au départ.`, "error"); } if (next > 71) next = 71 - (next - 71); state.positions[team] = Math.max(0, next); renderBoard(); if (next === 71) notify(`Bravo ! ${team} atteint le Palais des Mathématiques.`, "success"); }

function renderQuestion() { const questions = questionsDatabase[state.currentSeries]; const [text, seconds, correction] = questions[state.questionIndex]; $("question-counter").textContent = `Question ${state.questionIndex + 1} / ${questions.length}`; $("question-time").textContent = `Temps conseillé : ${seconds} s`; $("question-text").textContent = text; $("correction-text").textContent = correction; $("correction").classList.add("hidden"); clearInterval(state.timer); state.timeLeft = seconds; $("timer-display").textContent = `${seconds} s`; }
function startTimer() { clearInterval(state.timer); state.timeLeft = questionsDatabase[state.currentSeries][state.questionIndex][1]; $("timer-display").textContent = `${state.timeLeft} s`; state.timer = setInterval(() => { state.timeLeft--; $("timer-display").textContent = state.timeLeft > 0 ? `${state.timeLeft} s` : "Terminé"; if (state.timeLeft <= 0) { clearInterval(state.timer); notify("Temps écoulé !", "info"); } }, 1000); }
function drawStudent() { const list = students[$("class-select").value]; let count = 0; clearInterval(drawStudent.interval); drawStudent.interval = setInterval(() => { $("draw-result").textContent = `🎲 ${list[Math.floor(Math.random() * list.length)]}`; count++; if (count >= 12) { clearInterval(drawStudent.interval); const student = list[Math.floor(Math.random() * list.length)]; $("draw-result").textContent = `🎯 ${student}`; notify(`${student} est désigné(e).`, "success"); } }, 85); }
function login() { if ($("password").value === PASSWORD_PROF) { $("login-screen").classList.add("hidden"); $("app").classList.remove("hidden"); renderBoard(); renderQuestion(); notify("Bienvenue dans le Jeu de l’Oie Mathématique !", "success"); } else { notify("Mot de passe incorrect.", "error"); $("password").value = ""; } }

$("login-form").addEventListener("submit", event => { event.preventDefault(); login(); });
$("logout").addEventListener("click", () => { $("app").classList.add("hidden"); $("login-screen").classList.remove("hidden"); $("password").value = ""; });
$("series-select").addEventListener("change", event => { state.currentSeries = event.target.value; state.questionIndex = 0; renderQuestion(); });
$("load-session").addEventListener("click", () => { state.currentSeries = $("series-select").value; state.questionIndex = 0; renderQuestion(); notify(`${state.currentSeries} chargée.`, "success"); });
$("previous").addEventListener("click", () => { state.questionIndex = Math.max(0, state.questionIndex - 1); renderQuestion(); });
$("next").addEventListener("click", () => { state.questionIndex = Math.min(questionsDatabase[state.currentSeries].length - 1, state.questionIndex + 1); renderQuestion(); });
$("start-timer").addEventListener("click", startTimer); $("show-correction").addEventListener("click", () => $("correction").classList.toggle("hidden")); $("draw-student").addEventListener("click", drawStudent);
$("team-dashboard").addEventListener("click", event => { const button = event.target.closest("button[data-team]"); if (button) moveTeam(button.dataset.team, Number(button.dataset.move)); });
