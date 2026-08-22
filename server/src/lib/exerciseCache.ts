import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { exercises } from "./schema";
import { resolveExerciseName } from "./exerciseAliases";

type Exercise = typeof exercises.$inferSelect;

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

interface WorkoutXSearchResponse {
  total?: number;
  count?: number;
  data?: WorkoutXExercise[];
}

async function fetchFromWorkoutX(name: string): Promise<WorkoutXExercise | null> {
  try {
    const response = await fetch(
      `https://api.workoutxapp.com/v1/exercises?name=${encodeURIComponent(name)}`,
      {
        headers: {
          "X-WorkoutX-Key": process.env.WORKOUTX_API_KEY ?? "",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as WorkoutXSearchResponse;
    return body.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getExerciseByName(name: string): Promise<Exercise | null> {
  name = resolveExerciseName(name);

  const [cached] = await db
    .select()
    .from(exercises)
    .where(sql`lower(${exercises.name}) = lower(${name})`)
    .limit(1);

  if (cached) {
    return cached;
  }

  const external = await fetchFromWorkoutX(name);
  if (!external) {
    return null;
  }

  const [inserted] = await db
    .insert(exercises)
    .values({
      id: external.id,
      name: external.name,
      bodyPart: external.bodyPart,
      equipment: external.equipment,
      target: external.target,
      category: external.category,
      difficulty: external.difficulty,
      mechanic: external.mechanic,
      force: external.force,
      secondaryMuscles: external.secondaryMuscles,
      instructions: external.instructions,
      met: external.met,
      caloriesPerMinute: external.caloriesPerMinute,
      description: external.description,
      gifUrl: external.gifUrl,
    })
    .onConflictDoNothing()
    .returning();

  if (inserted) {
    return inserted;
  }

  const [existing] = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, external.id))
    .limit(1);

  return existing ?? null;
}
