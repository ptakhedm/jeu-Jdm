// Le mode debug nécessite cette option à true et le paramètre ?debug=1 dans l’URL.
export const DEBUG_ENABLED = true;

// Les données métier sont chargées depuis l’API et la base PostgreSQL.
export const teachers = {};
export const classNames = [];
export const classColors = [];
export const classCatalog = [];
export const classProgression = {};
export const students = {};
export const labels = [];

export function updateClassProgression(name, changes) {
  if (!classProgression[name]) classProgression[name] = {};
  Object.assign(classProgression[name], changes);
}
