import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { db } from "./db";
import { exercises } from "./schema";

export async function ensureGifCached(exerciseId: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, exerciseId))
    .limit(1);

  if (!row) {
    return null;
  }

  if (row.localGifUrl) {
    return row.localGifUrl;
  }

  if (!row.gifUrl) {
    return null;
  }

  const response = await fetch(row.gifUrl, {
    headers: {
      "X-WorkoutX-Key": process.env.WORKOUTX_API_KEY ?? "",
    },
  });

  if (!response.ok) {
    return null;
  }

  const gifData = await response.arrayBuffer();

  const blob = await put(`exercise-gifs/${exerciseId}.gif`, Buffer.from(gifData), {
    access: "public",
    contentType: "image/gif",
    allowOverwrite: true,
  });

  await db
    .update(exercises)
    .set({ localGifUrl: blob.url })
    .where(eq(exercises.id, exerciseId));

  return blob.url;
}
