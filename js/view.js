import { classNames, classColors, labels, teachers } from "./data.js";

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

// Une classe sans professeur associé ne possède pas de pion sur le plateau.
export function taughtClassNames() {
  const owned = new Set();
  Object.values(teachers).forEach(teacher => (teacher.classes || []).forEach(name => owned.add(name)));
  return classNames.filter(name => owned.has(name));
}

export function renderBoard(state) {
  const board = $("game-board");
  board.setAttribute("viewBox", "0 0 900 900");
  board.innerHTML = "";
  board.appendChild(svg("rect", { x: 0, y: 0, width: 900, height: 900, rx: 22, fill: "#efd193" }));
  const path = points.map(p => `${p.x},${p.y}`).join(" ");
  board.appendChild(svg("polyline", { points: path, fill: "none", stroke: "#a86c36", "stroke-width": 51, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".28" }));
  board.appendChild(svg("polyline", { points: path, fill: "none", stroke: "#fff0bd", "stroke-width": 43, "stroke-linecap": "round", "stroke-linejoin": "round" }));
  const finish = svg("g", { class: "palace" });
  finish.appendChild(svg("circle", { class: "palace-ring", cx: 450, cy: 450, r: 88, fill: "none", stroke: "#d18a27", "stroke-width": 3, "stroke-dasharray": "10 12" }));
  finish.appendChild(svg("circle", { cx: 450, cy: 450, r: 76, fill: "#fff8e8", stroke: "#9c612e", "stroke-width": 5 }));
  finish.appendChild(svg("ellipse", { cx: 450, cy: 492, rx: 48, ry: 8, fill: "#bcd98f", stroke: "#7fa052", "stroke-width": 2 }));
  finish.appendChild(svg("rect", { x: 398, y: 483, width: 104, height: 5, fill: "#e8c98a", stroke: "#9c612e", "stroke-width": 1.8, rx: 2 }));
  finish.appendChild(svg("rect", { x: 404, y: 478, width: 92, height: 5, fill: "#f2d9a0", stroke: "#9c612e", "stroke-width": 1.8, rx: 2 }));
  finish.appendChild(svg("rect", { x: 410, y: 473, width: 80, height: 5, fill: "#f2d9a0", stroke: "#9c612e", "stroke-width": 1.8, rx: 2 }));
  [425, 442, 459, 476].forEach(x => {
    finish.appendChild(svg("rect", { x: x - 4, y: 437, width: 8, height: 31, fill: "#fff6dc", stroke: "#9c612e", "stroke-width": 1.6 }));
    finish.appendChild(svg("rect", { x: x - 6, y: 468, width: 12, height: 5, fill: "#f2d9a0", stroke: "#9c612e", "stroke-width": 1.6, rx: 1.5 }));
    finish.appendChild(svg("rect", { x: x - 6, y: 432, width: 12, height: 5, fill: "#f2d9a0", stroke: "#9c612e", "stroke-width": 1.6, rx: 1.5 }));
  });
  finish.appendChild(svg("rect", { x: 415, y: 425, width: 70, height: 7, fill: "#e8c98a", stroke: "#9c612e", "stroke-width": 2, rx: 2 }));
  finish.appendChild(svg("path", { d: "M 414 425 L 450 402 L 486 425 Z", fill: "#f2cf7e", stroke: "#9c612e", "stroke-width": 2.5, "stroke-linejoin": "round" }));
  const pedimentPi = svg("text", { x: 450, y: 422.5, "text-anchor": "middle", fill: "#7a4a20", "font-size": 15, "font-weight": 900, "font-family": "'Baloo 2',cursive" });
  pedimentPi.textContent = "π";
  finish.appendChild(pedimentPi);
  finish.appendChild(svg("line", { x1: 450, y1: 402, x2: 450, y2: 390, stroke: "#9c612e", "stroke-width": 2 }));
  finish.appendChild(svg("path", { d: "M 450 390 L 462 393.5 L 450 397 Z", fill: "#d18a27" }));
  const palaceBanner = svg("text", { x: 450, y: 511, "text-anchor": "middle", fill: "#704026", "font-size": 12.5, "font-weight": 900, "letter-spacing": ".14em" });
  palaceBanner.textContent = "PALAIS";
  finish.appendChild(palaceBanner);
  board.appendChild(finish);

  points.forEach((point, index) => {
    const group = svg("g", { class: `cell ${index === 0 ? "cell-start" : index === 223 ? "cell-finish" : isPrime(index) ? "cell-bonus" : "cell-normal"}` });
    group.appendChild(svg("circle", { cx: point.x, cy: point.y, r: 25 }));
    if (index !== 0) {
      const number = svg("text", { x: point.x, y: point.y - 2, "text-anchor": "middle", class: "cell-number" });
      number.textContent = index;
      group.appendChild(number);
      const label = svg("text", { x: point.x, y: point.y + 13, "text-anchor": "middle", class: "cell-label" });
      label.textContent = isPrime(index) ? "★" : (labels[index % labels.length] || "");
      group.appendChild(label);
    }
    board.appendChild(group);
  });

  const start = points[0];
  const startDecoration = svg("g", { class: "start-decoration" });
  startDecoration.appendChild(svg("circle", { class: "start-halo", cx: start.x, cy: start.y, r: 32, fill: "#9fd0f0" }));
  startDecoration.appendChild(svg("circle", { class: "start-ring", cx: start.x, cy: start.y, r: 28.5, fill: "none", stroke: "#1c5f92", "stroke-width": 2.5, "stroke-dasharray": "6 7" }));
  startDecoration.appendChild(svg("circle", { cx: start.x, cy: start.y, r: 23.5, fill: "#5fa8dc", stroke: "#215b86", "stroke-width": 4 }));
  const goose = svg("g", { transform: `translate(${start.x} ${start.y}) scale(.5)` });
  goose.appendChild(svg("ellipse", { cx: 6, cy: 12, rx: 17, ry: 12, fill: "#fff9ef", stroke: "#4c6b7c", "stroke-width": 2.5 }));
  goose.appendChild(svg("path", { d: "M 16 6 C 18 -2 24 -10 30 -12 C 28 -4 24 2 20 8 Z", fill: "#fff9ef", stroke: "#4c6b7c", "stroke-width": 2.5, "stroke-linejoin": "round" }));
  goose.appendChild(svg("circle", { cx: 28.5, cy: -13, r: 6.5, fill: "#fff9ef", stroke: "#4c6b7c", "stroke-width": 2.5 }));
  goose.appendChild(svg("path", { d: "M 34 -14 L 43 -11.5 L 34 -8.5 Z", fill: "#e8862e", stroke: "#b8601a", "stroke-width": 1.5, "stroke-linejoin": "round" }));
  goose.appendChild(svg("circle", { cx: 30, cy: -14.5, r: 1.6, fill: "#25333c" }));
  goose.appendChild(svg("path", { d: "M 8 8 C 2 10 -1 14 0 17 C 4 18 9 16 12 12 Z", fill: "#eef2f5", stroke: "#4c6b7c", "stroke-width": 2, "stroke-linejoin": "round" }));
  goose.appendChild(svg("path", { d: "M 2 23 L 2 30 M 10 23 L 10 30", stroke: "#e8862e", "stroke-width": 2.5, "stroke-linecap": "round", fill: "none" }));
  goose.appendChild(svg("path", { d: "M -1 30 L 5 30 M 7 30 L 13 30", stroke: "#e8862e", "stroke-width": 2.5, "stroke-linecap": "round", fill: "none" }));
  startDecoration.appendChild(goose);
  const startLabel = svg("text", { x: start.x, y: start.y + 45, "text-anchor": "middle", fill: "#1c5f92", "font-size": 10.5, "font-weight": 900, "letter-spacing": ".1em" });
  startLabel.textContent = "DÉPART";
  startDecoration.appendChild(startLabel);
  board.appendChild(startDecoration);

  taughtClassNames().forEach(name => {
    const index = classNames.indexOf(name);
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
  taughtClassNames().forEach(name => {
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
    const positionLabel = data.pos === 0 ? "Case départ" : `Case ${data.pos}`;
    return `<div class="team-row ${name === state.activeClass ? "active-team" : ""}"><span class="team-dot" style="background:${data.color}"></span><strong class="class-name">${name}</strong><span class="class-stats">${positionLabel}<br>Série : ${data.rounds}${isPrime(data.pos) ? "<br>★ première" : ""}</span></div>`;
  }).join("");
  const currentName = state.teacher?.classes[state.current] || "";
  $("current-team").textContent = currentName;
  $("stage-team").textContent = currentName;
  $("teacher-session").textContent = state.teacher ? `${state.teacher.name} · classe active : ${state.activeClass}` : "";
}

export function updateQuestion(state, questionSets) {
  const question = questionSets[state.series][state.question];
  const rounds = state.classes[state.activeClass]?.rounds || 0;
  $("series-status").textContent = `Série en cours : ${state.series} · prochaine question : ${state.question + 1}/${questionSets[state.series].length} · série : ${rounds}`;
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
  $("show-correction").classList.add("is-hidden");
  $("show-correction").disabled = false;
  $("correct-answer").classList.add("is-hidden");
  $("wrong-answer").classList.add("is-hidden");
  $("correct-answer").disabled = false;
  $("wrong-answer").disabled = false;
  clearInterval(state.timer);
}
