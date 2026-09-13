import { neon } from "@neondatabase/serverless";
import { teachers, students, questionSets, labels, classCatalog, classProgression } from "../js/data.js";

const initialClasses = Object.entries(classProgression).map(([className, progression]) => ({
  className,
  position: progression.position,
  rounds: progression.rounds
}));
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl) throw new Error("DATABASE_URL ou POSTGRES_URL est requis");
const sql = neon(databaseUrl);

async function ensureDatabase() {
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
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
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
  const classes = await sql`SELECT class_name, position, rounds, updated_at FROM class_progression ORDER BY class_name`;
  return {
    content: content[0],
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
    await ensureDatabase();
    if (request.method === "GET") return response.status(200).json(await snapshot());
    if (request.method !== "POST") return response.status(405).json({ error: "Méthode non autorisée" });

    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
    const { className, position, rounds } = body;
    if (!className || !Number.isInteger(position) || !Number.isInteger(rounds)) {
      return response.status(400).json({ error: "Progression de classe invalide" });
    }

    await sql`
      INSERT INTO class_progression (class_name, position, rounds)
      VALUES (${className}, ${position}, ${rounds})
      ON CONFLICT (class_name) DO UPDATE SET position = EXCLUDED.position, rounds = EXCLUDED.rounds, updated_at = NOW()
    `;

    if (body.event === "answer") {
      if (typeof body.series !== "string" || !Number.isInteger(body.questionIndex) || typeof body.correct !== "boolean") {
        return response.status(400).json({ error: "Réponse invalide" });
      }
      await sql`
        INSERT INTO game_events (class_name, series, question_index, correct, position, rounds)
        VALUES (${className}, ${body.series}, ${body.questionIndex}, ${body.correct}, ${position}, ${rounds})
      `;
    }
    return response.status(200).json(await snapshot());
  } catch (error) {
    console.error("Erreur API game-state", error);
    return response.status(500).json({ error: "Base de données indisponible" });
  }
}
