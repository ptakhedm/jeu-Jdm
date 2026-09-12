# Jeu de l’Oie Mathématique

Application web autonome pour animer une séance de mathématiques au collège.

## Démarrage

Ouvrir `index.html` dans un navigateur moderne. Aucun serveur ni aucune dépendance ne sont nécessaires.

- Mot de passe professeur : `maths2026`
- Le plateau et les outils pédagogiques restent visibles simultanément.
- Les boutons `+`, `−` et `+2` permettent de gérer manuellement les six équipes.

## Fonctionnalités

- Plateau en spirale de 72 cases, de 0 à 71.
- Départ, arrivée, pont, hôtel, puits, labyrinthe, prison et tête de mort différenciés.
- Noms de mathématiciens et notions mathématiques intégrés au parcours.
- Séries de calcul mental 1 à 11 reprises des présentations fournies dans `pack-1`.
- Chronomètre, corrections masquables et navigation entre les questions.
- Tirage animé d’un élève selon la classe sélectionnée.
- Interface responsive utilisable sur ordinateur et vidéoprojecteur.

## Structure

- `index.html` : structure de l’interface.
- `styles.css` : design, plateau, cartes et responsive design.
- `app.js` : données pédagogiques et logique interactive.
- `pack-1/` : présentations sources des séries de calcul mental.
- `plateau.xlsx` : ancien support consulté pour la reprise des notions du plateau.
