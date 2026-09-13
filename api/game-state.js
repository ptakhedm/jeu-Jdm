import { neon } from "@neondatabase/serverless";
import { DEBUG_ENABLED, teachers, students, labels, classCatalog, classProgression, questionSets } from "./_content.js";

const initialClasses = Object.entries(classProgression).map(([className, progression]) => ({
  className,
  position: progression.position,
  rounds: progression.rounds
}));
let sql;

function getDatabaseClient() {
  if (sql) return sql;
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL ou POSTGRES_URL est requis dans les variables Vercel");
  sql = neon(databaseUrl);
  return sql;
}

async function ensureDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS teachers (
      teacher_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      classes JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS game_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      teachers JSONB NOT NULL,
      students JSONB NOT NULL,
      question_sets JSONB NOT NULL,
      labels JSONB NOT NULL,
      class_catalog JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE game_content ADD COLUMN IF NOT EXISTS class_catalog JSONB`;
  await sql`
    CREATE TABLE IF NOT EXISTS class_progression (
      class_name TEXT PRIMARY KEY,
      position INTEGER NOT NULL DEFAULT 0,
      rounds INTEGER NOT NULL DEFAULT 0,
      next_question INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE class_progression ADD COLUMN IF NOT EXISTS next_question INTEGER NOT NULL DEFAULT 0`;
  await sql`
    CREATE TABLE IF NOT EXISTS game_events (
      id BIGSERIAL PRIMARY KEY,
      class_name TEXT NOT NULL,
      series TEXT NOT NULL,
      question_index INTEGER NOT NULL,
      correct BOOLEAN NOT NULL,
      position INTEGER NOT NULL,
      rounds INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    INSERT INTO game_content (id, teachers, students, question_sets, labels, class_catalog)
    VALUES (1, ${JSON.stringify(teachers)}::jsonb, ${JSON.stringify(students)}::jsonb, ${JSON.stringify(questionSets)}::jsonb, ${JSON.stringify(labels)}::jsonb, ${JSON.stringify(classCatalog)}::jsonb)
    ON CONFLICT (id) DO NOTHING
  `;
  await sql`
    UPDATE game_content SET class_catalog = ${JSON.stringify(classCatalog)}::jsonb
    WHERE id = 1 AND class_catalog IS NULL
  `;
  for (const [teacherId, teacher] of Object.entries(teachers)) {
    await sql`
      INSERT INTO teachers (teacher_id, name, password, classes)
      VALUES (${teacherId}, ${teacher.name}, ${teacher.password}, ${JSON.stringify(teacher.classes)}::jsonb)
      ON CONFLICT (teacher_id) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password, classes = EXCLUDED.classes, updated_at = NOW()
    `;
  }
  for (const item of initialClasses) {
    await sql`
      INSERT INTO class_progression (class_name, position, rounds)
      VALUES (${item.className}, ${item.position}, ${item.rounds})
      ON CONFLICT (class_name) DO NOTHING
    `;
  }
}

async function snapshot() {
  const content = await sql`SELECT teachers, students, question_sets, labels, class_catalog FROM game_content WHERE id = 1`;
  const teacherRows = await sql`SELECT teacher_id, name, password, classes FROM teachers ORDER BY teacher_id`;
  const classes = await sql`SELECT class_name, position, rounds, next_question, updated_at FROM class_progression ORDER BY class_name`;
  const teachersFromDatabase = Object.fromEntries(teacherRows.map(teacher => [teacher.teacher_id, {
    name: teacher.name,
    classes: teacher.classes
  }]));
  return {
    content: {
      ...content[0],
      teachers: teachersFromDatabase,
      question_sets: Object.fromEntries(Object.entries(content[0].question_sets).map(([series, questions]) => [series, questions.map(([text, seconds, , image]) => [text, seconds, ...(image ? [image] : [])])] ))
    },
    classes
  };
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (request.method === "OPTIONS") return response.status(204).end();

  try {
    getDatabaseClient();
    await ensureDatabase();
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
    if (request.method === "POST" && body.action === "login") {
      const result = await sql`SELECT teacher_id, name, password, classes FROM teachers WHERE teacher_id = ${body.teacherId}`;
      const teacher = result[0];
      if (!teacher || teacher.password !== body.password) return response.status(401).json({ error: "Identifiants incorrects" });
      return response.status(200).json({ teacher: { id: teacher.teacher_id, name: teacher.name, classes: teacher.classes } });
    }
    if (request.method === "POST" && body.action === "debug-password") {
      if (!DEBUG_ENABLED) return response.status(403).json({ error: "Mode debug désactivé" });
      const result = await sql`SELECT password FROM teachers WHERE teacher_id = ${body.teacherId}`;
      if (!result[0]) return response.status(404).json({ error: "Professeur inconnu" });
      return response.status(200).json({ password: result[0].password });
    }
    if (request.method === "POST" && body.action === "record-answer") {
      const { className, series, questionIndex, correct } = body;
      if (!className || typeof series !== "string" || !Number.isInteger(questionIndex) || typeof correct !== "boolean") {
        return response.status(400).json({ error: "Réponse invalide" });
      }
      const progression = await sql`SELECT position, rounds FROM class_progression WHERE class_name = ${className}`;
      if (!progression[0]) return response.status(404).json({ error: "Classe inconnue" });
      const storedContent = await sql`SELECT question_sets FROM game_content WHERE id = 1`;
      const questionCount = storedContent[0]?.question_sets?.[series]?.length;
      if (!questionCount || questionIndex >= questionCount) return response.status(400).json({ error: "Question invalide" });
      const nextQuestion = (questionIndex + 1) % questionCount;
      await sql`UPDATE class_progression SET next_question = ${nextQuestion}, updated_at = NOW() WHERE class_name = ${className}`;
      await sql`
        INSERT INTO game_events (class_name, series, question_index, correct, position, rounds)
        VALUES (${className}, ${series}, ${questionIndex}, ${correct}, ${progression[0].position}, ${progression[0].rounds})
      `;
      const correction = storedContent[0]?.question_sets?.[series]?.[questionIndex]?.[2];
      return response.status(200).json({ correction });
    }
    if (request.method === "GET") return response.status(200).json(await snapshot());
    if (request.method !== "POST") return response.status(405).json({ error: "Méthode non autorisée" });

    const { className, position, rounds, nextQuestion = 0 } = body;
    if (!className || !Number.isInteger(position) || !Number.isInteger(rounds) || !Number.isInteger(nextQuestion)) {
      return response.status(400).json({ error: "Progression de classe invalide" });
    }

    await sql`
      INSERT INTO class_progression (class_name, position, rounds, next_question)
      VALUES (${className}, ${position}, ${rounds}, ${nextQuestion})
      ON CONFLICT (class_name) DO UPDATE SET position = EXCLUDED.position, rounds = EXCLUDED.rounds, next_question = EXCLUDED.next_question, updated_at = NOW()
    `;

    if (body.event === "answer") {
      if (typeof body.series !== "string" || !Number.isInteger(body.questionIndex) || typeof body.correct !== "boolean") {
        return response.status(400).json({ error: "Réponse invalide" });
      }
      await sql`
        INSERT INTO game_events (class_name, series, question_index, correct, position, rounds)
        VALUES (${className}, ${body.series}, ${body.questionIndex}, ${body.correct}, ${position}, ${rounds})
      `;
      const storedContent = await sql`SELECT question_sets FROM game_content WHERE id = 1`;
      const correction = storedContent[0]?.question_sets?.[body.series]?.[body.questionIndex]?.[2];
      return response.status(200).json({ ...(await snapshot()), correction });
    }
    return response.status(200).json(await snapshot());
  } catch (error) {
    console.error("Erreur API game-state", error);
    return response.status(500).json({
      error: "Base de données indisponible",
      detail: error.message
    });
  }
}
