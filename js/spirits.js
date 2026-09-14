// Les esprits des anciens mathématiciens hantent le plateau…
import { playGhostSigh } from "./sounds.js";

const SPIRITS = [
  { name: "Pythagore", emoji: "📐", quote: "Tout est nombre…" },
  { name: "Hypatie", emoji: "🕯️", quote: "Cherche la vérité des figures…" },
  { name: "Euclide", emoji: "📏", quote: "Il n’y a pas de chemin royal vers la géométrie…" },
  { name: "Galois", emoji: "⚔️", quote: "Je n’ai pas le temps, mais toi, persévère…" },
  { name: "Emmy Noether", emoji: "⭐", quote: "Les symétries révèlent les lois…" },
  { name: "Al-Khwarizmi", emoji: "🧮", quote: "Restaure et compare, l’équation se dévoilera…" },
  { name: "Sophie Germain", emoji: "💌", quote: "Les nombres premiers gardent leurs secrets…" },
  { name: "Euler", emoji: "👁️", quote: "Je contemple tes calculs depuis l’au-delà…" }
];

const CHEERERS = [
  { name: "Gauss", emoji: "🌟", quote: "Magnifique ! Ta raison brille !", quote2: "Exquis ! L’archimède d’aujourd’hui, c’est toi !" },
  { name: "Ramanujan", emoji: "✨", quote: "Une vision splendide !", quote2: "Même mes rêves n’étaient pas aussi justes !" },
  { name: "Cantor", emoji: "💫", quote: "Quel talent infini !", quote2: "Bravo, ton esprit franchit l’infini !" }
];

const COMFORTERS = [
  { name: "Descartes", emoji: "🧭", quote: "Erreur n’est pas ôter : je doute, donc j’apprends !", quote2: "Ressaisis-toi, la méthode viendra !" },
  { name: "Poincaré", emoji: "🌙", quote: "C’est en errant qu’on découvre de nouveaux chemins…", quote2: "Réessaie, l’intuition reviendra !" },
  { name: "Fermat", emoji: "📜", quote: "J’avais une remarque, mais la marge est trop étroite… courage !", quote2: "Ne t’inquiète pas, même moi j’ai laissé des questions sans réponse !" }
];

let spiritLayer = null;

function layer() {
  if (!spiritLayer) {
    spiritLayer = document.createElement("div");
    spiritLayer.className = "spirit-layer";
    document.body.appendChild(spiritLayer);
  }
  return spiritLayer;
}

// Crée un spectre générique (hantise, félicitation, encouragement) et l’anime.
function summonSpirit({ name, emoji, quote }, kind) {
  const host = layer();
  const spirit = document.createElement("div");
  spirit.className = `spirit ${kind}`;
  spirit.innerHTML = `
    <span class="spirit-body" aria-hidden="true">${emoji}</span>
    <div class="spirit-speech">
      <strong>${name}</strong>
      <span>${quote}</span>
    </div>`;
  host.appendChild(spirit);

  // Position aléatoire au moment de l'apparition.
  const left = 8 + Math.random() * 70;
  const top = 15 + Math.random() * 55;
  spirit.style.left = `${left}%`;
  spirit.style.top = `${top}%`;

  if (kind === "wanderer") playGhostSigh();

  // Disparition automatique.
  setTimeout(() => spirit.classList.add("fading"), kind === "wanderer" ? 4200 : 3200);
  setTimeout(() => spirit.remove(), kind === "wanderer" ? 5400 : 4400);
  return spirit;
}

// Spectre anonyme qui traverse le plateau au hasard.
export function hauntRandomly() {
  const spirit = SPIRITS[Math.floor(Math.random() * SPIRITS.length)];
  summonSpirit(spirit, "wanderer");
}

// Fantôme qui félicite l'élève après une bonne réponse.
export function summonCheer() {
  const pool = CHEERERS.map(c => ({ ...c, quote: Math.random() < 0.5 ? c.quote : c.quote2 }));
  summonSpirit(pool[Math.floor(Math.random() * pool.length)], "cheerer");
}

// Fantôme qui encourage l'élève après une mauvaise réponse.
export function summonComfort() {
  const pool = COMFORTERS.map(c => ({ ...c, quote: Math.random() < 0.5 ? c.quote : c.quote2 }));
  summonSpirit(pool[Math.floor(Math.random() * pool.length)], "comforter");
}

// Hantise ambiante : un spectre passe toutes les 25 à 60 secondes.
// Idempotent : sans effet si la hantise tourne déjà.
let hauntingStarted = false;
export function startHaunting() {
  if (hauntingStarted) return;
  hauntingStarted = true;
  const schedule = () => {
    const delay = 25000 + Math.random() * 35000;
    setTimeout(() => {
      hauntRandomly();
      schedule();
    }, delay);
  };
  schedule();
}
