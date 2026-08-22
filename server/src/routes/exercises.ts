import { Router } from "express";
import { and, eq, ilike } from "drizzle-orm";
import { getExerciseByName } from "../lib/exerciseCache";
import { db } from "../lib/db";
import { exercises } from "../lib/schema";

const router = Router();

router.get("/", async (req, res) => {
  const { search, equipment, target, difficulty, category, mechanic, force } =
    req.query;

  const conditions = [];
  if (typeof search === "string" && search.trim() !== "") {
    conditions.push(ilike(exercises.name, `%${search}%`));
  }
  if (typeof equipment === "string" && equipment.trim() !== "") {
    conditions.push(eq(exercises.equipment, equipment));
  }
  if (typeof target === "string" && target.trim() !== "") {
    conditions.push(eq(exercises.target, target));
  }
  if (typeof difficulty === "string" && difficulty.trim() !== "") {
    conditions.push(eq(exercises.difficulty, difficulty));
  }
  if (typeof category === "string" && category.trim() !== "") {
    conditions.push(eq(exercises.category, category));
  }
  if (typeof mechanic === "string" && mechanic.trim() !== "") {
    conditions.push(eq(exercises.mechanic, mechanic));
  }
  if (typeof force === "string" && force.trim() !== "") {
    conditions.push(eq(exercises.force, force));
  }

  const results = await db
    .select()
    .from(exercises)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(50);

  res.json(results);
});

router.get("/:name", async (req, res) => {
  const exercise = await getExerciseByName(req.params.name);

  if (!exercise) {
    return res.status(404).json({ error: "Exercise not found" });
  }

  res.json(exercise);
});

export default router;
