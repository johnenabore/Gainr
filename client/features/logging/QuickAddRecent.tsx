"use client";

import { RecentExercise } from "@/types/workout";

interface QuickAddRecentProps {
  exercises: RecentExercise[];
  onPick: (phrase: string) => void;
}

export function QuickAddRecent({ exercises, onPick }: QuickAddRecentProps) {
  if (exercises.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {exercises.map((ex) => {
        const phrase =
          ex.lastWeight !== null
            ? `${ex.name} ${ex.lastSets}x${ex.lastReps} @ ${ex.lastWeight}${ex.lastUnit}`
            : `${ex.name} ${ex.lastSets}x${ex.lastReps}`;

        return (
          <button
            key={ex.name}
            type="button"
            onClick={() => onPick(phrase)}
            className="group flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-[#3B9EE8]/50 hover:text-zinc-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B9EE8]"
          >
            <span>{ex.name}</span>
            <span className="font-mono text-xs text-zinc-500 group-hover:text-[#3B9EE8]">
              {ex.lastWeight !== null ? `${ex.lastWeight}${ex.lastUnit}` : "bw"}
            </span>
          </button>
        );
      })}
    </div>
  );
}