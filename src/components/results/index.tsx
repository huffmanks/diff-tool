import type { DiffLine, DiffResult } from "../../types";

interface Props {
  diffResult: DiffResult;
}

export default function Results({ diffResult }: Props) {
  return (
    <div className="font-mono text-sm">
      <div className="sticky top-0 flex border-b border-zinc-700 bg-zinc-900 text-xs font-bold">
        <div className="w-12 border-r border-zinc-700 p-3 text-center">Old</div>
        <div className="w-12 border-r border-zinc-700 p-3 text-center">New</div>
        <div className="flex-1 p-3 px-4">Changes</div>
      </div>
      <div className="scrollbar max-h-[600px] overflow-auto">
        {diffResult.lines.map((line, index) => (
          <DiffLineContent key={index} line={line} />
        ))}
      </div>
    </div>
  );
}

function DiffLineContent({ line }: { line: DiffLine }) {
  function getLineStyles() {
    switch (line.type) {
      case "added":
        return {
          colors: "bg-green-950 text-green-200",
          prefix: "+",
          prefixColor: "text-green-400",
        };
      case "removed":
        return {
          colors: "bg-red-950/60 text-red-200",
          prefix: "-",
          prefixColor: "text-red-400",
        };
      default:
        return {
          colors: "bg-zinc-800",
        };
    }
  }

  const styles = getLineStyles();

  return (
    <div className={`flex transition-colors ${styles.colors}`}>
      <div className="w-12 flex-shrink-0 border-r border-zinc-700 bg-zinc-800 p-3 text-right font-mono text-xs text-zinc-400">
        {line.oldLineNumber || ""}
      </div>
      <div className="w-12 flex-shrink-0 border-r border-zinc-700 bg-zinc-800 p-3 text-right font-mono text-xs text-zinc-400">
        {line.newLineNumber || ""}
      </div>
      <div className="flex-1 py-2 pr-5 pl-4 font-mono text-sm leading-relaxed">
        {styles.prefix && (
          <span className={`${styles.prefixColor} mr-2 font-bold`}>{styles.prefix}</span>
        )}
        {line.isInlineDiff ? (
          <span
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: line.content }}
          />
        ) : (
          <span className={`whitespace-pre-wrap ${line.type === "removed" ? "line-through" : ""}`}>
            {line.content}
          </span>
        )}
      </div>
    </div>
  );
}
