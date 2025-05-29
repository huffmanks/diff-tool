import { GitCompareIcon } from "lucide-react";
import type { DiffResult } from "../../types";

interface Props {
  diffResult: DiffResult;
}

export default function ResultsHeader({ diffResult }: Props) {
  return (
    <div className="border-b border-zinc-700 bg-zinc-900 px-3 py-4">
      <div className="grid grid-cols-1 items-center justify-between gap-y-4 sm:grid-cols-2">
        <h2 className="flex items-center gap-3 text-xl font-bold">
          <GitCompareIcon size={24} />
          Diff Analysis
        </h2>
        <div className="flex items-center gap-6 text-sm font-medium sm:justify-end">
          {diffResult.stats.additions > 0 && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
              <span className="size-2 rounded-full bg-green-600"></span>
              <span>+{diffResult.stats.additions}</span>
              <span className="hidden md:inline-block">added</span>
            </div>
          )}
          {diffResult.stats.deletions > 0 && (
            <div className="flex items-center justify-center gap-2 rounded-full bg-red-100 px-3 py-1 text-red-700">
              <span className="size-2 rounded-full bg-red-600"></span>
              <span>-{diffResult.stats.deletions}</span>
              <span className="hidden md:inline-block">removed</span>
            </div>
          )}
          {diffResult.stats.unchanged > 0 && (
            <div className="flex items-center justify-center gap-2 rounded-full bg-zinc-700 px-3 py-1">
              <span className="size-2 rounded-full bg-zinc-200"></span>
              <span>{diffResult.stats.unchanged}</span>
              <span className="hidden md:inline-block">unchanged</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
