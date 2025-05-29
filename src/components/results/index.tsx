import type { DiffLine, DiffResult } from "../../types";

interface Props {
  diffResult: DiffResult;
}

export default function Results({ diffResult }: Props) {
  return (
    <div className="font-mono text-sm">
      <div className="sticky top-0 flex border-b border-zinc-700 bg-zinc-900 text-xs font-bold">
        <div className="min-w-12 border-r border-zinc-700 p-3 text-center">Old</div>
        <div className="min-w-12 border-r border-zinc-700 p-3 text-center">New</div>
        <div className="flex-1 p-3 px-4">Changes</div>
      </div>
      <div className="scrollbar max-h-[600px] overflow-auto">
        {diffResult.lines.map((line, index) => (
          <DiffLineContent line={line} index={index} />
        ))}
      </div>
    </div>
  );
}

function DiffLineContent({ line, index }: { line: DiffLine; index: number }) {
  function getLineStyles() {
    switch (line.type) {
      case "added":
        return {
          bg: "bg-green-950 hover:bg-green-900",
          text: "text-green-200",
          prefix: "+",
          prefixColor: "text-green-400",
        };
      case "removed":
        return {
          bg: "bg-red-950 hover:bg-red-900",
          text: "text-red-200",
          prefix: "-",
          prefixColor: "text-red-400",
        };
      default:
        return {
          bg: "bg-zinc-800 hover:bg-zinc-700",
          text: "",
        };
    }
  }

  const styles = getLineStyles();

  return (
    <div key={index} className={`flex transition-colors ${styles.bg} ${styles.text}`}>
      <div className="min-w-12 flex-shrink-0 border-r border-zinc-700 bg-zinc-800 p-3 text-right font-mono text-xs text-zinc-400">
        {line.oldLineNumber || ""}
      </div>
      <div className="min-w-12 flex-shrink-0 border-r border-zinc-700 bg-zinc-800 p-3 text-right font-mono text-xs text-zinc-400">
        {line.newLineNumber || ""}
      </div>
      <div className="flex-1 py-2 pr-5 pl-4 font-mono text-sm leading-relaxed">
        {styles.prefix && (
          <span className={`${styles.prefixColor} mr-2 font-bold`}>{styles.prefix}</span>
        )}
        <span className="whitespace-pre-wrap">{line.content}</span>
      </div>
    </div>
  );
}
