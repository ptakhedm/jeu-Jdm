# Le Grand Jeu de l’Oie Mathématique

Application de classe ludique pour collège, reconstruite autour d’un véritable plateau de jeu.

## Lancer le jeu

Le projet utilise des modules JavaScript natifs. Depuis le dossier du projet, lancer un serveur local puis ouvrir l’adresse indiquée :

- `python3 -m http.server 8000`
- ouvrir `http://localhost:8000`

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

- `index.html` : structure de l’interface et écran de projection.
- `styles.css` : identité visuelle, mise en page et animations.
- `js/data.js` : professeurs, classes, élèves, progression, questions, corrections et figures. La fonction `updateClassProgression` constitue le point de branchement vers une future API/base de données.
- `js/view.js` : rendu DOM/SVG, affichage des questions et mise à jour visuelle.
- `js/game.js` : état de partie, règles, chrono, tirage au sort et événements.
- `js/api.js` : communication avec l’API de sauvegarde et de synchronisation.
- `api/game-state.js` : fonction serverless Vercel et initialisation des tables PostgreSQL.
- `sql/schema.sql` : schéma de la base de données.
- `pack-1/figures/` : figures extraites des présentations.

## Sauvegarde Vercel/PostgreSQL

Le projet utilise `@neondatabase/serverless`, avec une base Neon créée depuis les intégrations Vercel. L’API accepte `DATABASE_URL` (recommandé par Neon) ou `POSTGRES_URL` (compatibilité Vercel). Au premier appel de l’API, les données du jeu sont initialisées dans `game_content` et la progression dans `class_progression`.
Après cette initialisation, la base est la source de vérité ; les constantes de `js/data.js` servent uniquement d’amorçage si la base est vide ou inaccessible.

- Les professeurs, classes/couleurs, élèves, questions, corrections, durées et chemins des figures sont stockés dans `game_content`.
- Chaque réponse est enregistrée dans `game_events` avec la position et le tour de la classe.
- La progression de chaque classe est sauvegardée dans `class_progression` après chaque déplacement.
- Les clients connectés interrogent l’API toutes les 2 secondes afin de voir les déplacements des autres classes.
- Si la base n’est pas encore configurée, le jeu reste utilisable localement et affiche uniquement un avertissement dans la console.

Le mode debug est désactivé par défaut dans l’interface. Pour l’utiliser ponctuellement, `DEBUG_ENABLED` doit être à `true` dans `js/data.js` et l’URL doit contenir `?debug=1` ; le mot de passe est alors prérempli et chaque question dure 3 secondes.
