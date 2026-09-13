export const teachers = {
  garrel: { name: "Mme Garrel", password: "garrel2026", classes: ["6ème 1", "6ème 2"] },
  takhedmit: { name: "M. Takhedmit", password: "takhedmit2026", classes: ["6ème 2", "6ème 3"] },
  marovelli: { name: "Mme Marovelli", password: "marovelli2026", classes: ["6ème 3", "6ème 4"] },
  berquet: { name: "M. Berquet", password: "berquet2026", classes: ["6ème 4", "6ème 5"] }
};

// Le mode debug nécessite cette option à true et le paramètre ?debug=1 dans l’URL.
export const DEBUG_ENABLED = true;

export const classNames = ["6ème 1", "6ème 2", "6ème 3", "6ème 4", "6ème 5"];
export const classColors = ["#e15a4f", "#4e92ca", "#55a66f", "#e7a13b", "#9766bc"];
export const classCatalog = classNames.map((name, index) => ({ name, color: classColors[index] }));
// Données persistables : cette structure pourra être remplacée par la réponse de l’API.
export const classProgression = {
  "6ème 1": { position: 0, rounds: 0 },
  "6ème 2": { position: 0, rounds: 0 },
  "6ème 3": { position: 0, rounds: 0 },
  "6ème 4": { position: 0, rounds: 0 },
  "6ème 5": { position: 0, rounds: 0 }
};

// Point d’intégration pour la future persistance en base de données.
export function updateClassProgression(name, changes) {
  if (!classProgression[name]) return;
  Object.assign(classProgression[name], changes);
}

export const students = {
  "6ème 1": ["Lucas", "Chloé", "Nathan", "Inès", "Thomas", "Manon"],
  "6ème 2": ["Louis", "Louise", "Jules", "Alice", "Adam", "Lina"],
  "6ème 3": ["Arthur", "Emma", "Noah", "Léa", "Sacha", "Zoé"],
  "6ème 4": ["Léonie", "Timéo", "Agathe", "Tom", "Louise", "Léon"],
  "6ème 5": ["Gabriel", "Sarah", "Hugo", "Jade", "Enzo", "Mila"]
};

// Une question suit le format [énoncé, durée en secondes, correction, figure optionnelle].
export const questionSets = {
  "Série 1": [["9 × 8 = ?",30,"9 × 8 = 72."],["15 000 ÷ 100 = ?",45,"15 000 ÷ 100 = 150."],["729 − 177 = ?",60,"729 − 177 = 552."],["2 min 29 s = … s",45,"2 min = 120 s ; 120 + 29 = 149 s."],["10 km = … m",45,"10 km = 10 000 m."]],
  "Série 2": [["247 − 139 = ?",45,"247 − 139 = 108."],["4 h 38 min = … min",60,"4 × 60 min + 38 min = 278 min."],["Quel est le rang du chiffre 7 dans 23 478 905 ?",30,"7 est le chiffre des dizaines de milliers."],["8 dag = … mg",45,"8 dag = 80 000 mg."],["Combien y a-t-il de centaines de milliers dans 4 367 987 ?",45,"Le nombre possède 43 centaines de milliers."]],
  "Série 3": [["15 × 8 = ?",45,"15 × 8 = 120."],["Combien y a-t-il d’unités de milliers dans 4 367 987 ?",45,"Le nombre possède 4 367 unités de milliers."],["12 min 5 s = … secondes",60,"12 × 60 + 5 = 725 secondes."],["Quel est le rang du chiffre 3 dans 23 478 905 ?",30,"3 est le chiffre des unités de millions."],["De 13 h 15 à 13 h 51, combien de temps dure le trajet ?",45,"Le trajet dure 36 minutes."]],
  "Série 4": [["17 × 9 = ?",45,"17 × 9 = 153."],["12 roses coûtent 30 €. Combien coûtent 18 roses ?",45,"18 roses coûtent 45 €."],["Combien y a-t-il d’heures dans 3 jours et 13 heures ?",60,"3 × 24 h + 13 h = 85 h."],["31 cg = … g",45,"31 cg = 0,31 g."],["De 13 h 07 à 13 h 55, combien de temps dure le trajet ?",60,"Le trajet dure 48 minutes."]],
  "Série 5": [["Quelle est la moitié de 126 ?",30,"La moitié de 126 est 63."],["5 glaces coûtent 15 €. Combien coûte une glace ?",45,"Une glace coûte 3 €."],["Calcule : 135 × 100.",30,"135 × 100 = 13 500.","pack-1/figures/serie-05-question-3-1.png"],["Combien y a-t-il de secondes dans 4 minutes et 33 secondes ?",60,"4 × 60 + 33 = 273 secondes."],["Quelle fraction du carré est représentée par la partie grisée ?",45,"La partie grisée représente 3/8.","pack-1/figures/serie-05-question-5-1.png"]],
  "Série 6": [["61,4 cm = … m",30,"61,4 cm = 0,614 m."],["De 13 h 21 à 14 h 09, combien de temps dure le trajet ?",60,"Le trajet dure 48 minutes."],["9 × 7 − 25 = ?",45,"9 × 7 − 25 = 38."],["Combien y a-t-il d’heures dans 3 jours et 7 heures ?",45,"3 × 24 h + 7 h = 79 h."],["Quelle fraction du carré est coloriée ?",45,"La partie coloriée représente 3/4.","pack-1/figures/serie-06-question-5-1.png"]],
  "Série 7": [["À quelle fraction de u correspond la partie grisée ?",45,"La partie grisée correspond à 3/4.","pack-1/figures/serie-07-question-1-1.png"],["Inès a 12 cartes. Elle en a 4 fois plus que Léo. Combien Léo a-t-il de cartes ?",45,"Léo possède 3 cartes."],["11 × 9 − 31 = ?",45,"11 × 9 − 31 = 68."],["0,5 L = … mL",45,"0,5 L = 500 mL."],["Prends 23, multiplie-le par 3, soustrais 27 puis ajoute son chiffre des unités.",60,"23 × 3 = 69 ; 69 − 27 = 42 ; 42 + 3 = 45."]],
  "Série 8": [["Yacine mesure 1,52 m. Il mesure 13 cm de plus que Pierre. Quelle est la taille de Pierre ?",45,"1,52 − 0,13 = 1,39 m."],["12 pains au chocolat coûtent 15 €. Combien coûtent 18 pains au chocolat ?",60,"15 € + 7,50 € = 22,50 €."],["Un train part à 10 h 49. Le trajet dure 1 h 13. À quelle heure arrive-t-il ?",45,"Le train arrive à 12 h 02."],["100 − ? = 71",45,"100 − 29 = 71."],["Prends 14, multiplie-le par 4, soustrais 19 puis ajoute le double de son chiffre des unités.",60,"14 × 4 = 56 ; 56 − 19 = 37 ; 37 + 8 = 45."]],
  "Série 9": [["Combien de minutes représentent le quart de 2 heures ?",45,"Le quart de 2 heures représente 30 minutes."],["En observant la succession de figures, combien de carrés composent le motif n°5 ?",60,"Le motif n°5 est composé de 21 carrés.","pack-1/figures/serie-09-question-2-1.png"],["3 élèves se partagent 35 billes équitablement. Combien en auront-ils chacun ?",60,"Ils auront 11 billes chacun et il en restera 2."],["De 13 h 41 à 15 h 17, quelle est la durée du trajet ?",45,"La durée du trajet est de 1 h 36."],["Prends 11, multiplie-le par 7, soustrais 18 puis ajoute le double de son chiffre des unités.",60,"11 × 7 = 77 ; 77 − 18 = 59 ; 59 + 2 = 61."]],
  "Série 10": [["Combien de minutes représentent les trois quarts de 3 heures ?",45,"3 × 60 × 3/4 = 135 minutes."],["262 − ? = 87",45,"262 − 175 = 87."],["5 élèves se partagent 49 billes équitablement. Combien en restera-t-il ?",60,"Ils auront 9 billes chacun et il en restera 4."],["Quelle fraction de la figure est grisée ?",30,"La fraction correspond à 3/8.","pack-1/figures/serie-10-question-4-1.png"],["Prends 27, divise-le par 9, ajoute 18 puis multiplie par le chiffre des dizaines de départ.",60,"27 ÷ 9 = 3 ; 3 + 18 = 21 ; 21 × 2 = 42."]],
  "Série 11": [["9 × 9 − 15 = ?",45,"81 − 15 = 66."],["3 jours et 9 heures = … heures",60,"3 × 24 + 9 = 81 heures."],["Je suis un triangle dont les trois côtés sont de même mesure. Qui suis-je ?",30,"Un triangle équilatéral."],["Combien de fois y a-t-il le nombre 7 dans 420 ?",60,"7 × 60 = 420 : il y a 60 fois 7."],["Avec 50 €, je dépense la moitié de la moitié. Combien me reste-t-il ?",60,"50 − 12,50 = 37,50 €."]]
};

export const labels = ["DÉPART","Euclide","Pythagore","Descartes","Galois","Fibonacci","Riemann","Al-Karaji","Thalès","Hypatie","Fermat","Leibniz","Pascal","Desargues","Gauss","Euler","Turing","Boole","Cantor","Lagrange","Poisson","Laplace","Fourier","Cardan","Archimède","Ératosthène","Diophante","Napier","Brahmagupta","Bhaskara","Aryabhata","Zu Chongzhi","Héron","Ménélaüs","Ptolémée","Apollonius","Eudoxe","Zénon","Hippias","Anaxagore","Platon","Aristote","Bachet","Roberval","Mersenne","Torricelli","Viviani","Cavalieri","Newton","Stokes","Green","Hamilton","Galilée","Copernic","Kepler","Poincaré","Hilbert","Noether","Kowalevskaia","Germain","Lovelace","Ramanujan","Cauchy","Lagrange","Palais des Mathématiques"];
