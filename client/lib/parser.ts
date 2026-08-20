import { ParsedSet, WeightUnit } from "@/types/workout";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `parsed-${Date.now()}-${idCounter}`;
}

function splitIntoChunks(input: string): string[] {
  return input
    .split(/,|\bthen\b|\band\b/gi)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

const SETS_REPS_RE = /(\d+)\s*[x×]\s*(\d+)/i;
const WEIGHT_RE = /(?:@|at)?\s*(\d+(?:\.\d+)?)\s*(kg|lb|lbs)\b/i;
const BODYWEIGHT_HINTS = /\b(pull.?ups?|push.?ups?|dips?|bodyweight|bw)\b/i;

export function parseWorkoutText(input: string): ParsedSet[] {
  const chunks = splitIntoChunks(input);
  const results: ParsedSet[] = [];

  for (const chunk of chunks) {
    const setsReps = chunk.match(SETS_REPS_RE);
    const weightMatch = chunk.match(WEIGHT_RE);
    const isBodyweight = BODYWEIGHT_HINTS.test(chunk) && !weightMatch;

    let name = chunk
      .replace(SETS_REPS_RE, "")
      .replace(WEIGHT_RE, "")
      .replace(/\bfor\b|\bat\b|\breps?\b|\bsets?\b/gi, "")
      .trim()
      .replace(/\s+/g, " ");

    if (!name) continue;

    const sets = setsReps ? parseInt(setsReps[1], 10) : 1;
    const reps = setsReps ? parseInt(setsReps[2], 10) : 0;
    const weight = weightMatch ? parseFloat(weightMatch[1]) : null;
    const unit: WeightUnit = weightMatch && weightMatch[2].toLowerCase().startsWith("lb") ? "lb" : "kg";

    const confidence: "high" | "low" =
      setsReps && (weightMatch || isBodyweight) ? "high" : "low";

    results.push({
      id: nextId(),
      exerciseName: capitalize(name),
      sets,
      reps,
      weight,
      unit,
      confidence,
      raw: chunk,
    });
  }

  return results;
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}