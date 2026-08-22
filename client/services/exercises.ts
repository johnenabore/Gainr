const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ExerciseSummary {
  id: string;
  name: string;
  bodyPart: string | null;
  equipment: string | null;
  target: string | null;
  secondaryMuscles: string[] | null;
  category: string | null;
  difficulty: string | null;
  mechanic: string | null;
  force: string | null;
  met: number | null;
  caloriesPerMinute: number | null;
  description: string | null;
  instructions: string[] | null;
  isPlaceholder?: boolean;
}

export interface SearchExercisesParams {
  search?: string;
  equipment?: string;
  target?: string;
  difficulty?: string;
  category?: string;
  mechanic?: string;
  force?: string;
}

export async function searchExercises(
  params: SearchExercisesParams = {}
): Promise<ExerciseSummary[]> {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  const url = `${API_BASE}/api/exercises${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as ExerciseSummary[];
  } catch {
    return [];
  }
}

export function getExerciseGifUrl(exerciseId: string): string {
  return `${API_BASE}/api/exercise-gifs/${exerciseId}`;
}
