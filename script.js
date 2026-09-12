// script.js
const PASSWORD_PROF = "maths2026";

function afficherNotification(message, type = "info") {
    const banner = document.getElementById('notification-banner');
    if (!banner) return;
    banner.innerText = message;
    banner.className = "";
    if (type === "error") banner.classList.add("banner-error");
    else if (type === "success") banner.classList.add("banner-success");
    else banner.classList.add("banner-info");

    banner.style.display = "block";
    banner.style.opacity = "1";

    setTimeout(() => {
        banner.style.opacity = "0";
        setTimeout(() => { banner.style.display = "none"; }, 300);
    }, 4000);
}

function verifierLogin() {
    const saisi = document.getElementById('password-input').value;
    if (!saisi) {
        afficherNotification("Veuillez saisir un mot de passe.", "error");
        return;
    }
    
    if (saisi === PASSWORD_PROF) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        afficherNotification("Connexion réussie. Bienvenue !", "success");
        initBoard();
        chargerPartie();
    } else {
        afficherNotification("Mot de passe incorrect. Accès refusé.", "error");
        document.getElementById('password-input').value = "";
    }
}

function deconnexion() {
    document.getElementById('password-input').value = "";
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    afficherNotification("Déconnexion effectuée.", "info");
}

// Banques de questions
const questionsDatabase = {
    "seance_10": [
        { id: 1, texte: "Combien de minutes représentent les trois quarts de 3 heures ?", temps: 45, correction: "3 x 45 minutes = 135 minutes = 2h15mn" },
        { id: 2, texte: "262 - ? = 87", temps: 45, correction: "262 - 175 = 87" },
        { id: 3, texte: "5 élèves se partagent 49 billes équitablement. Combien en restera-t-il ?", temps: 60, correction: "Ils auront 9 billes chacun et il restera 4 billes." },
        { id: 4, texte: "Quelle est la fraction de la figure qui est grisée (3 parts sur 8) ?", temps: 30, correction: "La fraction correspond à 3/8." },
        { id: 5, texte: "Prends 27. Divise par 9. Ajoute 18. Multiplie par le chiffre des dizaines de départ.", temps: 60, correction: "27/9 = 3 | 3+18 = 21 | 21 x 2 = 42." }
    ],
    "seance_11": [
        { id: 1, texte: "9 x 9 - 15 = ?", temps: 45, correction: "9 x 9 = 81, puis 81 - 15 = 66." },
        { id: 2, texte: "3 jours et 9 heures = …………… heures", temps: 60, correction: "3 x 24 + 9 = 72 + 9 = 81 heures." },
        { id: 3, texte: "Je suis un triangle. Mes trois côtés sont de même mesure. Qui suis-je ?", temps: 30, correction: "Je suis un triangle équilatéral." },
        { id: 4, texte: "Combien de fois y a-t-il le nombre 7 dans 420 ?", temps: 60, correction: "7 x 60 = 420. Il y a 60 fois." },
        { id: 5, texte: "Si j’ai 50 euros et que je dépense la moitié de la moitié. Combien reste-t-il ?", temps: 60, correction: "La moitié de 50 est 25, la moitié de 25 est 12,50 €. Reste 37,50 €." }
    ]
};

const elevesParClasse = {
    "6A": ["Lucas", "Chloé", "Nathan", "Inès", "Thomas", "Manon", "Gabriel", "Sarah", "Hugo", "Jade"],
    "6B": ["Louis", "Louise", "Jules", "Alice", "Adam", "Lina", "Enzo", "Mila", "Raphaël", "Rose"],
    "6C": ["Arthur", "Emma", "Noah", "Léa", "Sacha", "Zoé", "Lucas", "Manon", "Ethan", "Chloé"],
    "6D": ["Léonie", "Timéo", "Agathe", "Tom", "Louise", "Léon", "Camille", "Nathan", "Juliette", "Paul"],
    "6E": ["Louis", "Alice", "Gabriel", "Sarah", "Hugo", "Jade", "Jules", "Lina", "Enzo", "Mila"],
    "6F": ["Raphaël", "Rose", "Arthur", "Emma", "Noah", "Léa", "Thomas", "Manon", "Adam", "Inès"]
};

let currentSeance = "seance_10";
let currentIndex = 0;
let timerInterval = null;

// Association des mathématiciens / notions aux 72 cases du plateau
const casesMaths = {
    0: "DEPART (Al-Khawarizmi)",
    1: "Euclide (Primes)",
    2: "Pythagore (Théorème)",
    3: "Descartes (Repère)",
    4: "Évariste Galois",
    5: "Pont ➔ Case 12",
    6: "Riemann",
    7: "Fibonacci",
    8: "Al-Karaji",
    9: "Thalès",
    10: "Hypatie",
    11: "Fibonacci (Suite)",
    12: "Fermat",
    13: "Leibniz",
    14: "Pascal (Triangle)",
    15: "Desargues",
    16: "Gauss",
    17: "Euler",
    18: "Hôtel (Pause)",
    19: "Turing",
    20: "Boole",
    21: "Cantor",
    22: "Lagrange",
    23: "Poisson",
    24: "Laplace",
    25: "Fourier",
    26: "Cardan",
    27: "Archimède",
    28: "Eratosthène",
    29: "Diophante",
    30: "Puits d'Euler",
    31: "Napier",
    32: "Brahmagupta",
    33: "Bhaskara",
    34: "Aryabhata",
    35: "Zu Chongzhi",
    36: "Héron",
    37: "Ménélaüs",
    38: "Ptolémée",
    39: "Apollonius",
    40: "Eudoxe",
    41: "Labyrinthe ➔ Case 30",
    42: "Zénon",
    43: "Hippias",
    44: "Anaxagore",
    45: "Platon",
    46: "Aristote",
    47: "Prison",
    48: "Bachet",
    49: "Roberval",
    50: "Mersenne",
    51: "Torricelli",
    52: "Viviani",
    53: "Tête de Mort ➔ 0",
    54: "Cavalieri",
    55: "Newton",
    56: "Stokes",
    57: "Green",
    58: "Hamilton",
    59: "Galilée",
    60: "Copernic",
    61: "Kepler",
    62: "Poincaré",
    63: "Hilbert",
    64: "Noether",
    65: "Kowalevskaia",
    66: "Germain",
    67: "Lovelace",
    68: "Ramanujan",
    69: "Cauchy",
    70: "Lagrange",
    71: "Palais des Mathématiques"
};

let positionsEquipes = {
    "Équipe 1": 0,
    "Équipe 2": 0,
    "Équipe 3": 0,
    "Équipe 4": 0,
    "Équipe 5": 0,
    "Équipe 6": 0
};

// Génération de la grille spirale 9x9 (72 cases numérotées de 0 à 71)
function initBoard() {
    const grid = document.getElementById('board-grid');
    const controls = document.getElementById('teams-control-panel');
    if (!grid || !controls) return;
    
    grid.innerHTML = '';
    controls.innerHTML = '';

    let mapCoord = {};
    let currentNum = 0;
    
    // Spirale 9x9 externe vers interne
    for(let c=0; c<9; c++) mapCoord[currentNum++] = {r: 0, c: c};
    for(let r=1; r<9; r++) mapCoord[currentNum++] = {r: r, c: 8};
    for(let c=7; c>=0; c--) mapCoord[currentNum++] = {r: 8, c: c};
    for(let r=7; r>=1; r--) mapCoord[currentNum++] = {r: r, c: 0};
    
    // Second anneau
    for(let c=1; c<8; c++) mapCoord[currentNum++] = {r: 1, c: c};
    for(let r=2; r<8; r++) mapCoord[currentNum++] = {r: r, c: 7};
    for(let c=6; c>=1; c--) mapCoord[currentNum++] = {r: 7, c: c};
    for(let r=6; r>=2; r--) mapCoord[currentNum++] = {r: r, c: 1};
    
    // Troisième anneau / centre (jusqu'à 71)
    for(let c=2; c<7; c++) mapCoord[currentNum++] = {r: 2, c: c};
    for(let r=3; r<7; r++) mapCoord[currentNum++] = {r: r, c: 6};
    for(let c=5; c>=2; c--) mapCoord[currentNum++] = {r: 6, c: c};
    for(let r=5; r>=3; r--) mapCoord[currentNum++] = {r: r, c: 2};
    for(let c=3; c<6; c++) mapCoord[currentNum++] = {r: 3, c: c};
    mapCoord[currentNum++] = {r: 4, c: 5};
    mapCoord[currentNum++] = {r: 5, c: 5}; // Case 71 (Arrivée)

    let cellsHTML = '';
    for (let i = 0; i <= 71; i++) {
        let coord = mapCoord[i] || {r: 0, c: 0};
        let labelInfo = casesMaths[i] || "";
        const specialClasses = {
            5: "case-pont",
            18: "case-hotel",
            30: "case-puits",
            41: "case-labyrinthe",
            47: "case-prison",
            53: "case-mort",
            71: "case-arrivee"
        };
        let isDepart = (i === 0) ? "case-depart" : (specialClasses[i] || "");
        
        let tokensHTML = '';
        for (let [team, pos] of Object.entries(positionsEquipes)) {
            if (pos === i) {
                let teamNum = team.replace("Équipe ", "");
                tokensHTML += `<div class="token token-${teamNum}" title="${team}">E${teamNum}</div>`;
            }
        }

        cellsHTML += `<div class="case-plateau ${isDepart}" style="grid-row: ${coord.r + 1}; grid-column: ${coord.c + 1};">
            <span class="num">${i === 0 ? 'DÉPART (0)' : i}</span>
            <span class="math-info">${labelInfo}</span>
            <div class="tokens-container">${tokensHTML}</div>
        </div>`;
    }

    // Panneau central
    cellsHTML += `<div class="center-board-panel">
        <h3>PALAIS DES MATHS</h3>
        <p>Objectif : Atteindre la case 71.</p>
        <p>🎲 Bonnes réponses = Avance.</p>
        <p>⚠️ Pièges : Puits (30), Labyrinthe (41).</p>
    </div>`;

    grid.innerHTML = cellsHTML;

    // Contrôles des équipes
    let teamColorClasses = { "Équipe 1": "token-1", "Équipe 2": "token-2", "Équipe 3": "token-3", "Équipe 4": "token-4", "Équipe 5": "token-5", "Équipe 6": "token-6" };
    
    for (let [team, pos] of Object.entries(positionsEquipes)) {
        let pillClass = teamColorClasses[team] || "";
        controls.innerHTML += `
            <div class="team-pill">
                <div class="token ${pillClass}" style="width:16px;height:16px;font-size:9px;">•</div>
                <span>${team} (Case ${pos})</span>
                <div style="display:flex; gap:2px; margin-left:4px;">
                    <button class="btn-success" style="padding:1px 5px; font-size:0.7rem;" onclick="avancerEquipe('${team}', 1)">+1</button>
                    <button class="btn-accent" style="padding:1px 5px; font-size:0.7rem;" onclick="avancerEquipe('${team}', 2)">+2</button>
                    <button style="background:var(--danger); padding:1px 5px; font-size:0.7rem;" onclick="avancerEquipe('${team}', -1)">-1</button>
                </div>
            </div>
        `;
    }
}

function avancerEquipe(team, delta) {
    let anciennePos = positionsEquipes[team];
    let nouvellePos = anciennePos + delta;
    
    if (nouvellePos === 5) { nouvellePos = 12; afficherNotification(`${team} passe du Pont à la case 12 !`, "success"); }
    else if (nouvellePos === 41) { nouvellePos = 30; afficherNotification(`${team} tombe dans le Labyrinthe et recule à la case 30 !`, "error"); }
    else if (nouvellePos === 53) { nouvellePos = 0; afficherNotification(`${team} tombe sur la Tête de mort et retourne au Départ !`, "error"); }

    if (nouvellePos > 71) {
        nouvellePos = 71 - (nouvellePos - 71);
    }
    
    positionsEquipes[team] = Math.max(0, nouvellePos);
    initBoard();

    if (positionsEquipes[team] === 71 && anciennePos !== 71) {
        afficherNotification(`🎉 ${team} a gagné la partie en atteignant le Palais des Mathématiques !`, "success");
    }
}

function chargerPartie() {
    const select = document.getElementById('select-seance');
    if (!select) return;
    currentSeance = select.value;
    currentIndex = 0;
    afficherQuestionCourante();
    afficherNotification("Séance chargée avec succès.", "success");
}

function afficherQuestionCourante() {
    const questions = questionsDatabase[currentSeance];
    if (!questions || !questions[currentIndex]) return;
    const q = questions[currentIndex];
    
    document.getElementById('q-counter').innerText = `Question ${currentIndex + 1} sur ${questions.length}`;
    document.getElementById('q-time-target').innerText = `Conseil : ${q.temps} s`;
    document.getElementById('question-text').innerText = q.texte;
    document.getElementById('timer-display').innerText = q.temps + " s";
    document.getElementById('correction-box').style.display = 'none';
    document.getElementById('correction-text').innerText = q.correction;
    
    clearInterval(timerInterval);
}

function changerQuestion(dir) {
    const questions = questionsDatabase[currentSeance];
    currentIndex += dir;
    if (currentIndex < 0) { currentIndex = 0; afficherNotification("Première question.", "info"); return; }
    if (currentIndex >= questions.length) { currentIndex = questions.length - 1; afficherNotification("Dernière question de la série.", "info"); return; }
    afficherQuestionCourante();
}

function lancerChrono() {
    const questions = questionsDatabase[currentSeance];
    let tempsRestant = questions[currentIndex].temps;
    const display = document.getElementById('timer-display');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        display.innerText = tempsRestant + " s";
        if (tempsRestant <= 0) {
            clearInterval(timerInterval);
            display.innerText = "Fin ⏰";
            afficherNotification("Temps écoulé pour cette question !", "info");
        }
        tempsRestant--;
    }, 1000);
}

function afficherCorrection() {
    document.getElementById('correction-box').style.display = 'block';
}

function tirerEleve() {
    const classeSelect = document.getElementById('select-classe');
    const classe = classeSelect ? classeSelect.value : "6A";
    const liste = elevesParClasse[classe];
    
    if (!liste) return;

    const resultatDiv = document.getElementById('selected-student');
    let compteur = 0;
    
    const anim = setInterval(() => {
        const aleatoireTemp = liste[Math.floor(Math.random() * liste.length)];
        resultatDiv.innerText = `🎲 ${aleatoireTemp}`;
        compteur++;
        if (compteur > 10) {
            clearInterval(anim);
            const eleveFinal = liste[Math.floor(Math.random() * liste.length)];
            resultatDiv.innerText = `🎯 ${eleveFinal}`;
        }
    }, 80);
}