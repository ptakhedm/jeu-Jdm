import { classNames, classColors, labels } from "./data.js";

export const $ = id => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";

export function notify(text) {
  const toast = $("toast");
  toast.textContent = text;
  toast.classList.add("visible");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

export function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function spiralCoordinates() {
  const cells = [];
  const add = (r, c) => cells.push({ x: 30 + c * 60, y: 30 + r * 60 });
  let top = 0, bottom = 14, left = 0, right = 14;
  while (top <= bottom && left <= right) {
    for (let r = top; r <= bottom; r++) add(r, left);
    left++;
    for (let c = left; c <= right; c++) add(bottom, c);
    bottom--;
    for (let r = bottom; r >= top; r--) add(r, right);
    right--;
    for (let c = right; c >= left; c--) add(top, c);
    top++;
  }
  const center = cells.findIndex(p => p.x === 450 && p.y === 450);
  if (center >= 0) cells.splice(center, 1);
  return cells;
}

const points = spiralCoordinates();

function svg(name, attrs = {}) {
  const node = document.createElementNS(svgNS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

export function renderBoard(state) {
  const board = $("game-board");
  board.setAttribute("viewBox", "0 0 900 900");
  board.innerHTML = "";
  board.appendChild(svg("rect", { x: 0, y: 0, width: 900, height: 900, rx: 22, fill: "#efd193" }));
  const path = points.map(p => `${p.x},${p.y}`).join(" ");
  board.appendChild(svg("polyline", { points: path, fill: "none", stroke: "#a86c36", "stroke-width": 51, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".28" }));
  board.appendChild(svg("polyline", { points: path, fill: "none", stroke: "#fff0bd", "stroke-width": 43, "stroke-linecap": "round", "stroke-linejoin": "round" }));
  const finish = svg("g");
  finish.appendChild(svg("circle", { cx: 450, cy: 450, r: 76, fill: "#fff8e8", stroke: "#9c612e", "stroke-width": 5 }));
  const finishText = svg("text", { x: 450, y: 443, "text-anchor": "middle", fill: "#704026", "font-size": 18, "font-weight": 900 });
  finishText.textContent = "FIN";
  finish.appendChild(finishText);
  const finishSubtext = svg("text", { x: 450, y: 468, "text-anchor": "middle", fill: "#704026", "font-size": 13, "font-weight": 900 });
  finishSubtext.textContent = "PALAIS";
  finish.appendChild(finishSubtext);
  board.appendChild(finish);

  points.forEach((point, index) => {
    const group = svg("g", { class: `cell ${index === 0 ? "cell-start" : index === 223 ? "cell-finish" : isPrime(index) ? "cell-bonus" : "cell-normal"}` });
    group.appendChild(svg("circle", { cx: point.x, cy: point.y, r: 25 }));
    const number = svg("text", { x: point.x, y: point.y - 2, "text-anchor": "middle", class: "cell-number" });
    number.textContent = index === 0 ? "D" : index;
    group.appendChild(number);
    const label = svg("text", { x: point.x, y: point.y + 13, "text-anchor": "middle", class: "cell-label" });
    label.textContent = isPrime(index) ? "★" : (labels[index % labels.length] || "");
    group.appendChild(label);
    board.appendChild(group);
  });

  classNames.forEach((name, index) => {
    const pawn = svg("g", { id: `pawn-${index}`, class: "pawn" });
    pawn.appendChild(svg("circle", { cx: 0, cy: 3, r: 19, fill: "#704026", opacity: ".28" }));
    pawn.appendChild(svg("circle", { cx: 0, cy: 0, r: 17, fill: classColors[index], stroke: "#fff", "stroke-width": 4 }));
    pawn.appendChild(svg("circle", { cx: -6, cy: -7, r: 4, fill: "#fff", opacity: ".7" }));
    board.appendChild(pawn);
  });
  positionPawns(state);
  renderClasses(state);
}

function pawnPosition(state, name, slotByPosition) {
  const classIndex = classNames.indexOf(name);
  const position = state.classes[name].pos;
  const slot = slotByPosition[position] || 1;
  const angle = (slot - 1) * Math.PI / 3;
  const radius = slot > 1 ? 20 : 0;
  const point = points[Math.min(position, 223)];
  return { classIndex, x: point.x + Math.cos(angle) * radius, y: point.y + Math.sin(angle) * radius };
}

export function positionPawns(state) {
  const seen = {};
  classNames.forEach(name => {
    const position = state.classes[name].pos;
    seen[position] = (seen[position] || 0) + 1;
    const target = pawnPosition(state, name, seen);
    const pawn = $("pawn-" + target.classIndex);
    if (pawn) pawn.setAttribute("transform", `translate(${target.x} ${target.y})`);
  });
}

export function animatePawn(state, name, fromPosition) {
  const classIndex = classNames.indexOf(name);
  const pawn = $("pawn-" + classIndex);
  if (!pawn) return;
  const from = points[Math.min(fromPosition, 223)];
  const to = points[Math.min(state.classes[name].pos, 223)];
  const start = performance.now();
  const duration = 430;
  const frame = now => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const hop = Math.sin(progress * Math.PI) * 22;
    pawn.setAttribute("transform", `translate(${from.x + (to.x - from.x) * eased} ${from.y + (to.y - from.y) * eased - hop})`);
    if (progress < 1) requestAnimationFrame(frame);
    else positionPawns(state);
  };
  requestAnimationFrame(frame);
}

export function renderClasses(state) {
  $("team-list").innerHTML = classNames.map(name => {
    const data = state.classes[name];
    return `<div class="team-row ${name === state.activeClass ? "active-team" : ""}"><span class="team-dot" style="background:${data.color}"></span><strong class="class-name">${name}</strong><span class="class-stats">Case ${data.pos}<br>${data.rounds} série${data.rounds === 1 ? "" : "s"}${isPrime(data.pos) ? "<br>★ première" : ""}</span></div>`;
  }).join("");
  const currentName = state.teacher?.classes[state.current] || "";
  $("current-team").textContent = currentName;
  $("stage-team").textContent = currentName;
  $("teacher-session").textContent = state.teacher ? `${state.teacher.name} · classe active : ${state.activeClass}` : "";
}

export function updateQuestion(state, questionSets) {
  const question = questionSets[state.series][state.question];
  const rounds = state.classes[state.activeClass]?.rounds || 0;
  const completed = `${rounds} série${rounds === 1 ? "" : "s"} terminée${rounds === 1 ? "" : "s"}`;
  $("series-status").textContent = `Série en cours : ${state.series} · prochaine question : ${state.question + 1}/${questionSets[state.series].length} · ${completed}`;
  $("stage-counter").textContent = `Question ${state.question + 1} / ${questionSets[state.series].length}`;
  $("stage-question").textContent = question[0];
  $("correction-text").textContent = question[2];
  const figure = $("question-figure");
  figure.src = question[3] || "";
  figure.classList.toggle("is-hidden", !question[3]);
  figure.alt = question[0];
  $("timer-value").textContent = question[1];
  $("timer-ring").style.setProperty("--progress", "100%");
  $("timer-ring").classList.remove("urgent");
  $("stage-correction").classList.add("is-hidden");
  $("close-correction").classList.add("is-hidden");
  $("draw-phase").classList.add("is-hidden");
  $("student-phase").classList.add("is-hidden");
  $("question-phase").classList.remove("is-hidden");
  $("stage-question").classList.remove("is-hidden");
  $("correct-answer").classList.add("is-hidden");
  $("wrong-answer").classList.add("is-hidden");
  $("correct-answer").disabled = false;
  $("wrong-answer").disabled = false;
  clearInterval(state.timer);
}
