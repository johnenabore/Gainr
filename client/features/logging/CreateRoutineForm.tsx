"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, ArrowLeft, Dumbbell } from "lucide-react";
import { AddExercisePicker } from "./AddExercisePicker";
import { ExerciseInfoDialog } from "./ExerciseInfoDialog";
import { getExerciseGifUrl, type ExerciseSummary } from "@/services/exercises";

interface Template {
  name: string;
  exercises: string[];
}

const templates: Template[] = [
  { name: "Push day", exercises: ["Bench press", "Overhead press", "Triceps pushdown"] },
  { name: "Pull day", exercises: ["Deadlift", "Lat pulldown", "Barbell row"] },
  { name: "Leg day", exercises: ["Back squat", "Leg press", "Calf raise"] },
];

function templateExercise(name: string): ExerciseSummary {
  return {
    id: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    bodyPart: null,
    equipment: null,
    target: null,
    secondaryMuscles: null,
    category: null,
    difficulty: null,
    mechanic: null,
    force: null,
    met: null,
    caloriesPerMinute: null,
    description: null,
    instructions: null,
    isPlaceholder: true,
  };
}

export function CreateRoutineForm() {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSave = title.trim().length > 0 && exercises.length > 0;

  function applyTemplate(t: Template) {
    setTitle(t.name);
    setExercises(t.exercises.map(templateExercise));
  }

  function addExercise() {
    setPickerOpen(true);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="h-[18px] w-[18px]" />
          <span className="text-base font-medium text-foreground">Build your day</span>
        </button>
        <Button size="sm" disabled={!canSave}>
          Save
        </Button>
      </div>

      <Input
        placeholder="e.g. Push day"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
          Quick start
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => applyTemplate(t)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {t.name}
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono text-primary">
                {t.exercises.length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {exercises.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 border-dashed py-8 text-center">
          <Dumbbell className="h-7 w-7 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Nothing loaded yet.
            <br />
            Add your first exercise below.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {exercises.map((ex, i) => (
            <Card key={i} className="flex flex-row items-center gap-3 px-3 py-2.5">
              <span className="w-6 font-mono text-xs text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {ex.isPlaceholder ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <img
                  src={getExerciseGifUrl(ex.id)}
                  alt=""
                  loading="lazy"
                  className="h-9 w-9 shrink-0 rounded-lg bg-muted object-cover"
                />
              )}
              <span className="flex-1 text-sm">{ex.name}</span>
              <ExerciseInfoDialog exercise={ex} />
              <button
                onClick={() => removeExercise(i)}
                aria-label={`Remove ${ex.name}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Button variant="outline" onClick={addExercise} className="border-primary text-primary hover:bg-primary/10">
        <Plus className="mr-1.5 h-4 w-4" />
        Add exercise
      </Button>

      {pickerOpen && (
        <AddExercisePicker
          onSelect={(exercise) => {
            setExercises((prev) => [...prev, exercise]);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}