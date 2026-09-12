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
        { id: 4, texte: "Quelle est la fraction de la figure qui est grisée ?", temps: 30, correction: "La fraction correspond à 3/8." },
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

// Listes d'élèves par classe
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

// Association des mathématiciens / notions aux cases du Jeu de l'Oie (de 0 à 63)
const casesMaths = {
    0: "Départ",
    1: "Al-Khawarizmi (Algèbre)",
    2: "Euclide (Nombres premiers)",
    3: "Pythagore (Théorème)",
    4: "Descartes (Repère)",
    5: "Évariste Galois (Groupes)",
    6: "Pont ➔ Case 12",
    7: "Riemann (Hypothèse)",
    8: "Fibonacci (Suite)",
    9: "Al-Karaji",
    10: "Thalès",
    11: "Hypatie",
    12: "Fibonacci (Lapins)",
    13: "Fermat (Dernier Th.)",
    14: "Leibniz (Calcul)",
    15: "Pascal (Triangle)",
    16: "Desargues",
    17: "Gauss (Prince)",
    18: "Euler (Identité)",
    19: "Hôtel (Pause)",
    20: "Turing (Machine)",
    21: "Boole (Logique)",
    22: "Cantor (Infinis)",
    23: "Lagrange",
    24: "Poisson",
    25: "Laplace",
    26: "Fourier",
    27: "Cubic (Cardan)",
    28: "Archimède (Parfait)",
    29: "Eratosthène (Crible)",
    30: "Diophante",
    31: "Puits d'Euler",
    32: "Napier (Logarithmes)",
    33: "Brahmagupta",
    34: "Bhaskara",
    35: "Aryabhata",
    36: "Zu Chongzhi ($\pi$)",
    37: "Hero d'Alexandrie",
    38: "Menelaus",
    39: "Ptolémée",
    40: "Apollonius",
    41: "Eudoxe",
    42: "Labyrinthe ➔ Case 30",
    43: "Zenon (Paradoxe)",
    44: "Ératosthène (Terre)",
    45: "Thétanos",
    46: "Hippias",
    47: "Anaxagore",
    48: "Thalès (Pyramide)",
    49: "Pythagore (Irrationnels)",
    50: "Platon (Solides)",
    51: "Aristote",
    52: "Prison (Blocage)",
    53: "Bachet",
    54: "Roberval",
    55: "Mersenne (Primes)",
    56: "Torricelli",
    57: "Viviani",
    58: "Tête de Mort ➔ 0",
    59: "Cavalieri",
    60: "Descartes (Géométrie)",
    61: "Fermat",
    62: "Newton (Fluxions)",
    63: "Palais des Mathématiques"
};

let positionsEquipes = {
    "Équipe 1": 0,
    "Équipe 2": 0,
    "Équipe 3": 0,
    "Équipe 4": 0,
    "Équipe 5": 0,
    "Équipe 6": 0
};

// Disposition en grille 9x7 (63 cases + le panneau central)
// On définit l'ordre des cases de 0 à 63 pour former un circuit en spirale autour du centre.
function initBoard() {
    const grid = document.getElementById('board-grid');
    const controls = document.getElementById('teams-control-panel');
    if (!grid || !controls) return;
    
    grid.innerHTML = '';
    controls.innerHTML = '';

    // Définition de la grille 9 colonnes x 7 lignes (63 cases numérotées de 0 à 63)
    // Coordonnées (ligne, colonne) en index 0-based pour placer les cases en spirale externe
    let mapCoord = {};
    let currentNum = 0;
    
    // Ligne 0 (haut de gauche à droite : 0 à 8)
    for(let c=0; c<9; c++) mapCoord[currentNum++] = {r: 0, c: c};
    // Colonne 8 (droite de haut en bas : 9 à 14)
    for(let r=1; r<7; r++) mapCoord[currentNum++] = {r: r, c: 8};
    // Ligne 6 (bas de droite à gauche : 15 à 23)
    for(let c=7; c>=0; c--) mapCoord[currentNum++] = {r: 6, c: c};
    // Colonne 0 (gauche de bas en haut : 24 à 28)
    for(let r=5; r>=1; r--) mapCoord[currentNum++] = {r: r, c: 0};
    
    // Second anneau intérieur
    for(let c=1; c<8; c++) mapCoord[currentNum++] = {r: 1, c: c};
    for(let r=2; r<6; r++) mapCoord[currentNum++] = {r: r, c: 7};
    for(let c=6; c>=1; c--) mapCoord[currentNum++] = {r: 5, c: c};
    for(let r=4; r>=2; r--) mapCoord[currentNum++] = {r: r, c: 1};
    
    // Troisième anneau / centre
    for(let c=2; c<7; c++) mapCoord[currentNum++] = {r: 2, c: c};
    mapCoord[currentNum++] = {r: 3, c: 6};
    mapCoord[currentNum++] = {r: 4, c: 6};
    for(let c=5; c>=2; c--) mapCoord[currentNum++] = {r: 4, c: c};
    mapCoord[currentNum++] = {r: 3, c: 2};
    // Fin vers la case 63 au centre
    mapCoord[currentNum++] = {r: 3, c: 3};
    mapCoord[currentNum++] = {r: 3, c: 4};
    mapCoord[currentNum++] = {r: 3, c: 5}; // Case 63

    // Création des 63 cases dans la grille CSS grid (9x7)
    let cellsHTML = '';
    for (let i = 0; i <= 63; i++) {
        let coord = mapCoord[i] || {r: 0, c: 0};
        let labelInfo = casesMaths[i] || "";
        
        // Recherche des équipes sur cette case
        let tokensHTML = '';
        for (let [team, pos] of Object.entries(positionsEquipes)) {
            if (pos === i) {
                let teamNum = team.replace("Équipe ", "");
                tokensHTML += `<div class="token token-${teamNum}" title="${team}">E${teamNum}</div>`;
            }
        }

        cellsHTML += `<div class="case-plateau" style="grid-row: ${coord.r + 1}; grid-column: ${coord.c + 1};">
            <span class="num">${i}</span>
            <span class="math-info">${labelInfo}</span>
            <div class="tokens-container">${tokensHTML}</div>
        </div>`;
    }

    // Ajout du panneau central des règles au milieu de la grille
    cellsHTML += `<div class="center-board-panel">
        <h3>JEU DE L'OIE MATHÉMATIQUE</h3>
        <p>Objectif : Atteindre la case 63 (Palais des Mathématiques).</p>
        <p>🎲 +1 ou +2 cases par bonne réponse.</p>
        <p>⚠️ Pièges : Puits (31), Labyrinthe (42), Tête de mort (58).</p>
    </div>`;

    grid.innerHTML = cellsHTML;

    // Génération des boutons de contrôle des équipes sous le plateau
    let teamColorClasses = { "Équipe 1": "token-1", "Équipe 2": "token-2", "Équipe 3": "token-3", "Équipe 4": "token-4", "Équipe 5": "token-5", "Équipe 6": "token-6" };
    
    for (let [team, pos] of Object.entries(positionsEquipes)) {
        let pillClass = teamColorClasses[team] || "";
        controls.innerHTML += `
            <div class="team-pill">
                <div class="token ${pillClass}" style="width:18px;height:18px;font-size:10px;">•</div>
                <span>${team} (Case ${pos})</span>
                <div style="display:flex; gap:3px; margin-left:5px;">
                    <button class="btn-success" style="padding:2px 6px; font-size:0.75rem;" onclick="avancerEquipe('${team}', 1)">+1</button>
                    <button class="btn-accent" style="padding:2px 6px; font-size:0.75rem;" onclick="avancerEquipe('${team}', 2)">+2</button>
                    <button style="background:var(--danger); padding:2px 6px; font-size:0.75rem;" onclick="avancerEquipe('${team}', -1)">-1</button>
                </div>
            </div>
        `;
    }
}

function avancerEquipe(team, delta) {
    let anciennePos = positionsEquipes[team];
    let nouvellePos = anciennePos + delta;
    
    // Règles spéciales du jeu de l'oie
    if (nouvellePos === 6) { nouvellePos = 12; afficherNotification(`${team} passe du Pont à la case 12 !`, "success"); }
    else if (nouvellePos === 42) { nouvellePos = 30; afficherNotification(`${team} tombe dans le Labyrinthe et recule à la case 30 !`, "error"); }
    else if (nouvellePos === 58) { nouvellePos = 0; afficherNotification(`${team} tombe sur la Tête de mort et retourne à la case départ !`, "error"); }

    if (nouvellePos > 63) {
        // Règle du rebond si dépassement de 63
        nouvellePos = 63 - (nouvellePos - 63);
    }
    
    positionsEquipes[team] = Math.max(0, nouvellePos);
    initBoard();

    if (positionsEquipes[team] === 63 && anciennePos !== 63) {
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
    document.getElementById('q-time-target').innerText = `Temps conseillé : ${q.temps} s`;
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
            display.innerText = "Temps écoulé ! ⏰";
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
        resultatDiv.innerText = `🎲 Tirage... ${aleatoireTemp}`;
        compteur++;
        if (compteur > 10) {
            clearInterval(anim);
            const eleveFinal = liste[Math.floor(Math.random() * liste.length)];
            resultatDiv.innerText = `🎯 Élève désigné : ${eleveFinal}`;
        }
    }, 80);
}