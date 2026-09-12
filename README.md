# Le Grand Jeu de l’Oie Mathématique

Application de classe ludique pour collège, reconstruite autour d’un véritable plateau de jeu.

## Lancer le jeu

Ouvrir `index.html` dans un navigateur moderne.

- Comptes de démonstration : `garrel2026`, `takhedmit2026`, `marovelli2026`, `berquet2026`
- Aucun serveur ni installation nécessaire.
- Les sources historiques sont conservées dans `pack-1/` et `plateau.xlsx`.

## Fonctionnalités

- Plateau SVG illustré inspiré du jeu de l’oie traditionnel.
- Parcours repris du classeur : 224 cases numérotées de 0 à 223, avec arrivée centrale.
- Un pion par classe, tous visibles par tous les professeurs connectés.
- Chaque professeur possède plusieurs classes et ne peut déplacer que ses classes.
- Bonne réponse : +2 cases ; mauvaise réponse : −1 case.
- Les seuls bonus de case sont les nombres premiers : +3 cases à l’arrêt.
- Cinq bonnes réponses dans une série : +2 cases bonus.
- Les cases sont volontairement agrandies pour accueillir les pions visuellement.
- Question affichée en très grand dans un mode adapté à la projection.
- Chronomètre circulaire animé, pulsation dans les dix dernières secondes et correction masquable.
- Tirage animé d’un élève par classe.

## Structure

- `index.html` : interface et écran de projection.
- `styles.css` : identité visuelle et animations.
- `app.js` : plateau SVG, règles, questions, chrono et tirage au sort.
