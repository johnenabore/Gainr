"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getExerciseGifUrl, type ExerciseSummary } from "@/services/exercises";

interface ExerciseInfoDialogProps {
  exercise: ExerciseSummary;
  className?: string;
}

export function ExerciseInfoDialog({ exercise, className }: ExerciseInfoDialogProps) {
  const [open, setOpen] = useState(false);

  if (exercise.isPlaceholder) {
    return null;
  }

  const tags = [
    exercise.difficulty,
    exercise.category,
    exercise.mechanic,
    exercise.force,
  ].filter((tag): tag is string => Boolean(tag));

  const muscles = [exercise.target, ...(exercise.secondaryMuscles ?? [])].filter(
    (muscle): muscle is string => Boolean(muscle)
  );

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`About ${exercise.name}`}
        className={cn(
          "shrink-0 text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <Info className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] gap-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">{exercise.name}</DialogTitle>
            {exercise.description ? (
              <DialogDescription>{exercise.description}</DialogDescription>
            ) : null}
          </DialogHeader>

          <img
            src={getExerciseGifUrl(exercise.id)}
            alt={exercise.name}
            className="h-48 w-full rounded-2xl bg-muted object-contain"
          />

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <dl className="flex flex-col gap-2">
            {muscles.length > 0 ? (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Muscles</dt>
                <dd className="flex-1 capitalize">{muscles.join(", ")}</dd>
              </div>
            ) : null}

            {exercise.equipment ? (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Equipment</dt>
                <dd className="flex-1 capitalize">{exercise.equipment}</dd>
              </div>
            ) : null}

            {typeof exercise.met === "number" ? (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">MET</dt>
                <dd className="flex-1 font-mono text-primary">{exercise.met}</dd>
              </div>
            ) : null}

            {typeof exercise.caloriesPerMinute === "number" ? (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Cals / min</dt>
                <dd className="flex-1 font-mono text-primary">
                  {exercise.caloriesPerMinute}
                </dd>
              </div>
            ) : null}
          </dl>

          {exercise.instructions && exercise.instructions.length > 0 ? (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Instructions
              </p>
              <ol className="flex flex-col gap-1.5">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="w-5 shrink-0 font-mono text-xs text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
