import "dotenv/config";
import { db } from "../src/lib/db";
import { exercises } from "../src/lib/schema";

interface WorkoutXExercise {
  id: string;
  name: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  category?: string;
  difficulty?: string;
  mechanic?: string;
  force?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  met?: number;
  caloriesPerMinute?: number;
  description?: string;
  gifUrl?: string;
}

interface WorkoutXListResponse {
  results?: WorkoutXExercise[];
  data?: WorkoutXExercise[];
}

const LIMIT = 20;
const DELAY_MS = 2200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(offset: number): Promise<WorkoutXExercise[]> {
  const url = new URL("https://api.workoutxapp.com/v1/exercises");
  url.searchParams.set("limit", String(LIMIT));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("sortMethod", "name");
  url.searchParams.set("sortOrder", "ascending");

  const response = await fetch(url, {
    headers: {
      "X-WorkoutX-Key": process.env.WORKOUTX_API_KEY ?? "",
    },
  });

  if (!response.ok) {
    throw new Error(
      `WorkoutX request failed at offset ${offset}: HTTP ${response.status} ${response.statusText}`
    );
  }

  const body = (await response.json()) as WorkoutXExercise[] | WorkoutXListResponse;

  if (Array.isArray(body)) {
    return body;
  }
  if (Array.isArray(body.results)) {
    return body.results;
  }
  if (Array.isArray(body.data)) {
    return body.data;
  }
  return [];
}

async function main() {
  let offset = 0;
  let requestsMade = 0;
  let totalInserted = 0;
  let totalSkipped = 0;

  while (true) {
    const page = await fetchPage(offset);
    requestsMade++;

    if (page.length === 0) {
      console.log(`[offset ${offset}] empty page — stopping.`);
      break;
    }

    const rows = page.map((ex) => ({
      id: ex.id,
      name: ex.name,
      bodyPart: ex.bodyPart,
      equipment: ex.equipment,
      target: ex.target,
      category: ex.category,
      difficulty: ex.difficulty,
      mechanic: ex.mechanic,
      force: ex.force,
      secondaryMuscles: ex.secondaryMuscles,
      instructions: ex.instructions,
      met: ex.met,
      caloriesPerMinute: ex.caloriesPerMinute,
      description: ex.description,
      gifUrl: ex.gifUrl,
    }));

    const inserted = await db
      .insert(exercises)
      .values(rows)
      .onConflictDoNothing()
      .returning({ id: exercises.id });

    const insertedCount = inserted.length;
    const skippedCount = rows.length - insertedCount;
    totalInserted += insertedCount;
    totalSkipped += skippedCount;

    console.log(
      `[offset ${offset}] fetched ${page.length}, inserted ${insertedCount}, skipped ${skippedCount} ` +
        `(totals — requests: ${requestsMade}, inserted: ${totalInserted}, skipped: ${totalSkipped})`
    );

    offset += page.length;
    await sleep(DELAY_MS);
  }

  console.log(
    `Done. Requests made: ${requestsMade}, inserted: ${totalInserted}, skipped: ${totalSkipped}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });