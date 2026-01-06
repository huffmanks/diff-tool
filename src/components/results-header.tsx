import { type DiffFile } from "@git-diff-view/file";

interface Props {
  diffFile: DiffFile;
}

export default function ResultsHeader({ diffFile }: Props) {
  const additions = diffFile.additionLength;
  const deletions = diffFile.deletionLength;
  const total = diffFile.unifiedLineLength;

  const unchangedLinesCount = total - (additions + deletions);

  return (
    <div className="border-b border-zinc-700 bg-zinc-900 px-3 py-4">
      <div className="grid grid-cols-1 items-center justify-between gap-y-4 sm:grid-cols-2">
        <h2 className="flex items-center gap-3 text-xl font-bold">
          <svg
            className="size-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle
              cx="18"
              cy="18"
              r="3"
            />
            <circle
              cx="6"
              cy="6"
              r="3"
            />
            <path d="M13 6h3a2 2 0 0 1 2 2v7" />
            <path d="M11 18H8a2 2 0 0 1-2-2V9" />
          </svg>
          Diff Analysis
        </h2>
        <div className="flex items-center gap-6 text-sm font-medium sm:justify-end">
          {additions > 0 && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
              <span className="size-2 rounded-full bg-green-600"></span>
              <span>+{additions}</span>
              <span className="hidden md:inline-block">added</span>
            </div>
          )}
          {deletions > 0 && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700">
              <span className="size-2 rounded-full bg-red-600"></span>
              <span>-{deletions}</span>
              <span className="hidden md:inline-block">removed</span>
            </div>
          )}
          {unchangedLinesCount > 0 && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-zinc-700 px-3 py-1">
              <span className="size-2 rounded-full bg-zinc-200"></span>
              <span>{unchangedLinesCount}</span>
              <span className="hidden md:inline-block">unchanged</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
