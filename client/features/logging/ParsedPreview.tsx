"use client";

import { ParsedSet } from "@/types/workout";

interface ParsedPreviewProps {
  sets: ParsedSet[];
  onEdit: (id: string, patch: Partial<ParsedSet>) => void;
  onRemove: (id: string) => void;
}

export function ParsedPreview({ sets, onEdit, onRemove }: ParsedPreviewProps) {
  if (sets.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
        Type a set and it'll show up here before you save it.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/60 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-dashed border-zinc-800 px-4 py-2 text-xs uppercase tracking-wider text-zinc-500">
        <span>Parsed</span>
        <span>{sets.length} exercise{sets.length === 1 ? "" : "s"}</span>
      </div>

      <ul className="divide-y divide-dashed divide-zinc-800">
        {sets.map((set) => (
          <li
            key={set.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              set.confidence === "low" ? "bg-amber-500/[0.04]" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-sans text-[15px] font-medium text-zinc-100">
                  {set.exerciseName}
                </span>
                {set.confidence === "low" && (
                  <span className="shrink-0 rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-sans font-medium tracking-wide text-amber-400">
                    check this
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-zinc-500">"{set.raw}"</div>
            </div>

            <div className="flex shrink-0 items-baseline gap-1 tabular-nums">
              <input
                type="number"
                value={set.sets}
                onChange={(e) => onEdit(set.id, { sets: Number(e.target.value) })}
                className="w-7 rounded bg-transparent text-right text-zinc-100 focus:bg-zinc-900 focus:outline-none"
              />
              <span className="text-zinc-600">×</span>
              <input
                type="number"
                value={set.reps}
                onChange={(e) => onEdit(set.id, { reps: Number(e.target.value) })}
                className="w-7 rounded bg-transparent text-zinc-100 focus:bg-zinc-900 focus:outline-none"
              />
              {set.weight !== null ? (
                <>
                  <span className="ml-1 text-zinc-600">@</span>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => onEdit(set.id, { weight: Number(e.target.value) })}
                    className="w-12 rounded bg-transparent text-right text-[#3B9EE8] focus:bg-zinc-900 focus:outline-none"
                  />
                  <span className="text-zinc-500">{set.unit}</span>
                </>
              ) : (
                <span className="ml-1 text-zinc-500">bw</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove(set.id)}
              aria-label={`Remove ${set.exerciseName}`}
              className="shrink-0 rounded p-1 font-sans text-zinc-600 hover:text-zinc-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B9EE8]"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}