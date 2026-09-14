// Effets sonores synthétisés avec la Web Audio API (aucun fichier audio requis).
let audioContext = null;

function context() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

// Les navigateurs exigent une interaction utilisateur avant de produire du son.
document.addEventListener("pointerdown", () => context(), { once: true });

function noiseBuffer(ctx, duration) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index++) data[index] = Math.random() * 2 - 1;
  return buffer;
}

// Bruit de pas : petit souffle grave et feutré, légèrement aléatoire.
export function playFootstep() {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, 0.14);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 380 + Math.random() * 200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.16);
}

// Pièce d'or : carillon métallique brillant et scintillant.
export function playCoin() {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  [[1318.5, 0], [1760, 0.09], [2093, 0.18], [2637, 0.3]].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.25, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.6);
  });
}

// Soupir de spectre : glissando descendant éthéré avec vibrato.
export function playGhostSigh() {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(170, now + 1.7);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 6;
  const vibratoGain = ctx.createGain();
  vibratoGain.gain.value = 15;
  vibrato.connect(vibratoGain).connect(osc.frequency);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  vibrato.start(now);
  osc.stop(now + 2);
  vibrato.stop(now + 2);
}

// Bonne réponse : arpège majeur joyeux et lumineux.
export function playCheer() {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  [[523.25, 0], [659.25, 0.11], [783.99, 0.22], [1046.5, 0.33]].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.22, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.5);
  });
}

// Mauvaise réponse : deux notes douces et chaleureuses, encourageantes.
export function playEncourage() {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  [[392, 0], [329.63, 0.28]].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.2, now + delay + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.75);
  });
}