import gameStateHandler from "./game-state.js";

// Route dédiée à la console d’administration. La logique et les contrôles
// d’accès restent centralisés dans game-state pour partager la base de données.
export default async function handler(request, response) {
  return gameStateHandler(request, response);
}
