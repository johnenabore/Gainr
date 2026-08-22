
export const exerciseAliases: Record<string, string> = {
  "deadlift": "Barbell Deadlift",
  "bench press": "Barbell Bench Press",
  "squat": "Barbell Back Squat",
  "overhead press": "Barbell Overhead Press",
  "pull up": "Pull-Up",
  "row": "Barbell Row",
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, " ")   
    .replace(/\s+/g, " ");    
}

export function resolveExerciseName(parsedName: string): string {
  const key = normalize(parsedName);
  return exerciseAliases[key] ?? parsedName;
}