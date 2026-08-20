// app/(app)/(with-header)/routines/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";

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
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Your routines
        </h1>
        <Link
          href="/routines/new"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
        >
          <Plus className="h-4 w-4 text-[#3B9EE8]" />
        </Link>
      </div>

      {mockRoutines.map((routine) => (
        <div
          key={routine.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[15px] font-medium text-zinc-100">{routine.name}</span>
            <span className="font-mono text-xs text-[#3B9EE8]">
              {routine.exercises.length} exercises
            </span>
          </div>
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">
            {routine.exercises.join(", ")}
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-[#3B9EE8] py-2.5 text-sm font-medium text-[#042c53]"
          >
            Start routine
          </button>
        </div>
      ))}

      <Link
        href="/routines/new"
        className="flex items-center gap-2.5 rounded-2xl border border-dashed border-zinc-800 px-3.5 py-3.5"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900">
          <Plus className="h-4 w-4 text-zinc-500" />
        </div>
        <div>
          <div className="text-sm text-zinc-300">New routine</div>
          <div className="text-xs text-zinc-600">Build another day from scratch or a template</div>
        </div>
      </Link>

      <Link
        href="/log"
        className="text-center text-xs text-zinc-600 underline underline-offset-4"
      >
        or just log a workout without a routine
      </Link>
    </div>
  );
}