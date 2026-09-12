# Le Grand Jeu de l’Oie Mathématique

Application de classe ludique pour collège, reconstruite autour d’un véritable plateau de jeu.

## Lancer le jeu

Ouvrir `index.html` dans un navigateur moderne.

- Mot de passe professeur : `maths2026`
- Aucun serveur ni installation nécessaire.
- Les sources historiques sont conservées dans `pack-1/` et `plateau.xlsx`.

## Fonctionnalités

- Plateau SVG illustré inspiré du jeu de l’oie traditionnel.
- 72 cases, départ en case 0 et Palais des Mathématiques en case 71.
- Six pions d’équipes visibles directement sur le plateau.
- Lancer de dé animé et déplacement pion par pion.
- Cases spéciales : Pont, Hôtel, Puits, Labyrinthe, Prison et Tête de mort.
- Question affichée en très grand dans un mode adapté à la projection.
- Chronomètre circulaire animé, pulsation dans les dix dernières secondes et correction masquable.
- Tirage animé d’un élève par classe.

## Structure

- `index.html` : interface et écran de projection.
- `styles.css` : identité visuelle et animations.
- `app.js` : plateau SVG, règles, questions, chrono et tirage au sort.
