const endpoint = "/api/game-state";

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

export async function loadGameSnapshot() {
  return request(endpoint, { cache: "no-store" });
}

export async function authenticateTeacher(teacherId, password) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify({ action: "login", teacherId, password })
  });
}

export async function loadDebugPassword(teacherId) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify({ action: "debug-password", teacherId })
  });
}

export async function saveGameState(className, progression, event = null) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify({
      className,
      position: progression.pos,
      rounds: progression.rounds,
      nextQuestion: progression.nextQuestion || 0,
      ...(event || {})
    })
  });
}

export async function recordAnswer(className, series, questionIndex, correct) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify({ action: "record-answer", className, series, questionIndex, correct })
  });
}
