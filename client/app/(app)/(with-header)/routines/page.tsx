// app/(app)/(with-header)/routines/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MockRoutine {
  id: string;
  name: string;
  exercises: string[];
}

const mockRoutines: MockRoutine[] = [
  {
    id: "push-day-1",
    name: "Push Day 1",
    exercises: ["Bench press", "Overhead press", "Triceps pushdown", "Incline fly", "Lateral raise"],
  },
  {
    id: "pull-day-1",
    name: "Pull Day 1",
    exercises: ["Deadlift", "Lat pulldown", "Barbell row", "Bicep curl"],
  },
];

export default function RoutinesPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Your routines
        </h1>
        <Link
          href="/routines/new"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card"
        >
          <Plus className="h-4 w-4 text-primary" />
        </Link>
      </div>

      {mockRoutines.map((routine) => (
        <Card key={routine.id} size="sm" className="px-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[15px] font-medium text-foreground">{routine.name}</span>
            <Badge variant="secondary" className="font-mono text-primary">
              {routine.exercises.length} exercises
            </Badge>
          </div>
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {routine.exercises.join(", ")}
          </p>
          <Button className="w-full">Start routine</Button>
        </Card>
      ))}

      <Link
        href="/routines/new"
        className="flex items-center gap-2.5 rounded-2xl border border-dashed border-border px-3.5 py-3.5"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm text-foreground">New routine</div>
          <div className="text-xs text-muted-foreground">Build another day from scratch or a template</div>
        </div>
      </Link>

      <Link
        href="/log"
        className="text-center text-xs text-muted-foreground underline underline-offset-4"
      >
        or just log a workout without a routine
      </Link>
    </div>
  );
}
