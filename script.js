// script.js
const PASSWORD_PROF = "maths2026";

// Système de notification utilisateur pour éviter les écrans figés
function afficherNotification(message, type = "info") {
    const banner = document.getElementById('notification-banner');
    banner.innerText = message;
    banner.className = ""; // Reset classes
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

// Banques de questions issues des diaporamas
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
const NB_CASES = 15;
let positionsEquipes = {
    "Équipe 1": 0,
    "Équipe 2": 0,
    "Équipe 3": 0,
    "Équipe 4": 0,
    "Équipe 5": 0,
    "Équipe 6": 0
};

function initBoard() {
    const container = document.getElementById('board-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (let [team, pos] of Object.entries(positionsEquipes)) {
        let trackHTML = `<div class="team-track">
            <div class="team-track-header">
                <span>${team}</span>
                <span>Case : ${pos} / ${NB_CASES}</span>
            </div>
            <div class="track-grid" id="track-${team}">`;
        
        for (let i = 0; i <= NB_CASES; i++) {
            let activeClass = (i === pos) ? 'active' : '';
            trackHTML += `<div class="case ${activeClass}">${i}</div>`;
        }
        
        trackHTML += `</div>
            <div class="team-controls">
                <button class="btn-success" onclick="avancerEquipe('${team}', 1)">+1 Case</button>
                <button class="btn-accent" onclick="avancerEquipe('${team}', 2)">+2 Cases</button>
                <button style="background:var(--danger)" onclick="avancerEquipe('${team}', -1)">-1</button>
            </div>
        </div>`;
        
        container.innerHTML += trackHTML;
    }
}

function avancerEquipe(team, delta) {
    let anciennePos = positionsEquipes[team];
    positionsEquipes[team] = Math.min(NB_CASES, Math.max(0, positionsEquipes[team] + delta));
    initBoard();
    if (positionsEquipes[team] === NB_CASES && anciennePos !== NB_CASES) {
        afficherNotification(`🎉 ${team} a atteint la fin du plateau !`, "success");
    }
}

function reinitialiserScores() {
    if(confirm("Voulez-vous replacer toutes les équipes au départ (Case 0) ?")) {
        for (let team in positionsEquipes) positionsEquipes[team] = 0;
        initBoard();
        afficherNotification("Plateau réinitialisé.", "info");
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
    if (!questions || !questions[currentIndex]) {
        afficherNotification("Erreur lors du chargement de la question.", "error");
        return;
    }
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
    if (currentIndex < 0) {
        currentIndex = 0;
        afficherNotification("Vous êtes déjà à la première question.", "info");
        return;
    }
    if (currentIndex >= questions.length) {
        currentIndex = questions.length - 1;
        afficherNotification("Vous êtes à la dernière question de la série.", "info");
        return;
    }
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
    
    if (!liste || liste.length === 0) {
        afficherNotification("Aucun élève trouvé pour cette classe.", "error");
        return;
    }

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