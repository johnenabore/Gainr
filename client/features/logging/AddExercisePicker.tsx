"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Dumbbell, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ExerciseInfoDialog } from "./ExerciseInfoDialog";
import {
  getExerciseGifUrl,
  searchExercises,
  type ExerciseSummary,
} from "@/services/exercises";

const EQUIPMENT_OPTIONS = [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "smith machine",
  "body weight",
  "kettlebell",
  "resistance band",
  "ez barbell",
  "medicine ball",
  "stability ball",
];

const TARGET_OPTIONS = [
  "pectorals",
  "lats",
  "upper back",
  "traps",
  "delts",
  "biceps",
  "triceps",
  "forearms",
  "abs",
  "glutes",
  "quads",
  "hamstrings",
  "calves",
  "adductors",
  "abductors",
];

const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"];

const CATEGORY_OPTIONS = ["strength", "cardio", "stretching", "plyometrics"];

const MECHANIC_OPTIONS = ["compound", "isolation"];

const FORCE_OPTIONS = ["push", "pull", "hold", "carry"];

const selectClassName =
  "h-9 flex-1 rounded-3xl border border-border bg-card px-3 text-sm capitalize text-foreground outline-none transition-colors focus-visible:border-ring";

interface SheetFilterProps {
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SheetFilter({ label, allLabel, value, options, onChange }: SheetFilterProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${selectClassName} w-full flex-none`}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

interface AddExercisePickerProps {
  onSelect: (exercise: ExerciseSummary) => void;
  onClose: () => void;
}

export function AddExercisePicker({ onSelect, onClose }: AddExercisePickerProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [equipment, setEquipment] = useState("");
  const [target, setTarget] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [mechanic, setMechanic] = useState("");
  const [force, setForce] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [results, setResults] = useState<ExerciseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    searchExercises({
      search: debouncedSearch || undefined,
      equipment: equipment || undefined,
      target: target || undefined,
      difficulty: difficulty || undefined,
      category: category || undefined,
      mechanic: mechanic || undefined,
      force: force || undefined,
    }).then((data) => {
      if (cancelled) return;
      setResults(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, equipment, target, difficulty, category, mechanic, force]);

  // Loading is raised here rather than in the effect above so the spinner shows
  // during the debounce window too, and to keep setState out of an effect body.
  function changeSearch(value: string) {
    setSearch(value);
    setLoading(true);
  }

  function changeEquipment(value: string) {
    setEquipment(value);
    setLoading(true);
  }

  function changeTarget(value: string) {
    setTarget(value);
    setLoading(true);
  }

  function changeDifficulty(value: string) {
    setDifficulty(value);
    setLoading(true);
  }

  function changeCategory(value: string) {
    setCategory(value);
    setLoading(true);
  }

  function changeMechanic(value: string) {
    setMechanic(value);
    setLoading(true);
  }

  function changeForce(value: string) {
    setForce(value);
    setLoading(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Close exercise picker"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </button>
          <span className="text-base font-medium text-foreground">Add exercise</span>
        </div>

        <Input
          placeholder="Search exercises"
          value={search}
          onChange={(e) => changeSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            value={equipment}
            onChange={(e) => changeEquipment(e.target.value)}
            aria-label="Filter by equipment"
            className={selectClassName}
          >
            <option value="">All Equipment</option>
            {EQUIPMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={target}
            onChange={(e) => changeTarget(e.target.value)}
            aria-label="Filter by target muscle"
            className={selectClassName}
          >
            <option value="">All Muscles</option>
            {TARGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            aria-label="More filters"
            className="h-9 shrink-0 rounded-3xl"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="gap-0">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 pt-2 pb-6">
            <SheetFilter
              label="Difficulty"
              allLabel="All Difficulties"
              value={difficulty}
              options={DIFFICULTY_OPTIONS}
              onChange={changeDifficulty}
            />
            <SheetFilter
              label="Category"
              allLabel="All Categories"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={changeCategory}
            />
            <SheetFilter
              label="Mechanic"
              allLabel="All Mechanics"
              value={mechanic}
              options={MECHANIC_OPTIONS}
              onChange={changeMechanic}
            />
            <SheetFilter
              label="Force"
              allLabel="All Forces"
              value={force}
              options={FORCE_OPTIONS}
              onChange={changeForce}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 pb-6">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Searching…</p>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No exercises found.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {results.map((ex) => {
              const subtitle = [ex.target, ex.bodyPart].filter(Boolean).join(" · ");

              return (
                <div
                  key={ex.id}
                  className="flex items-center rounded-2xl transition-colors hover:bg-muted"
                >
                  <button
                    onClick={() => onSelect(ex)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-2 text-left"
                  >
                    {ex.isPlaceholder ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Dumbbell className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        src={getExerciseGifUrl(ex.id)}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-lg bg-muted object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{ex.name}</p>
                      {subtitle ? (
                        <p className="truncate text-xs capitalize text-muted-foreground">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                  </button>

                  <ExerciseInfoDialog exercise={ex} className="mr-3 ml-1" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
