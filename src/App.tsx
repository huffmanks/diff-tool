import * as Diff from "diff";
import { CheckIcon, CopyIcon, FileTextIcon, GitCompareIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface DiffResult {
  lines: DiffLine[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}

export default function App() {
  const [originalText, setOriginalText] = useState("");
  const [changedText, setChangedText] = useState("");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const computeDiff = useCallback((original: string, changed: string): DiffResult => {
    const splitIntoSentences = (text: string) => {
      return text
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => sentence.trim().length > 0)
        .map((sentence) => sentence.trim());
    };

    const originalSentences = splitIntoSentences(original);
    const changedSentences = splitIntoSentences(changed);

    if (originalSentences.length > 1 || changedSentences.length > 1) {
      const diff = Diff.diffArrays(originalSentences, changedSentences);
      const diffLines: DiffLine[] = [];
      let oldLineNum = 1;
      let newLineNum = 1;
      let additions = 0;
      let deletions = 0;
      let unchanged = 0;

      diff.forEach((part) => {
        part.value.forEach((sentence: string) => {
          if (part.added) {
            diffLines.push({
              type: "added",
              content: sentence,
              oldLineNumber: undefined,
              newLineNumber: newLineNum,
            });
            newLineNum++;
            additions++;
          } else if (part.removed) {
            diffLines.push({
              type: "removed",
              content: sentence,
              oldLineNumber: oldLineNum,
              newLineNumber: undefined,
            });
            oldLineNum++;
            deletions++;
          } else {
            diffLines.push({
              type: "unchanged",
              content: sentence,
              oldLineNumber: oldLineNum,
              newLineNumber: newLineNum,
            });
            oldLineNum++;
            newLineNum++;
            unchanged++;
          }
        });
      });

      return {
        lines: diffLines,
        stats: { additions, deletions, unchanged },
      };
    } else {
      const diff = Diff.diffWords(original, changed);
      const diffLines: DiffLine[] = [];
      let oldLineNum = 1;
      let newLineNum = 1;
      let additions = 0;
      let deletions = 0;
      let unchanged = 0;

      diff.forEach((part) => {
        if (part.added) {
          diffLines.push({
            type: "added",
            content: part.value,
            oldLineNumber: undefined,
            newLineNumber: newLineNum,
          });
          newLineNum++;
          additions++;
        } else if (part.removed) {
          diffLines.push({
            type: "removed",
            content: part.value,
            oldLineNumber: oldLineNum,
            newLineNumber: undefined,
          });
          oldLineNum++;
          deletions++;
        } else {
          diffLines.push({
            type: "unchanged",
            content: part.value,
            oldLineNumber: oldLineNum,
            newLineNumber: newLineNum,
          });
          oldLineNum++;
          newLineNum++;
          unchanged++;
        }
      });

      return {
        lines: diffLines,
        stats: { additions, deletions, unchanged },
      };
    }
  }, []);

  const diffResult = useMemo(() => {
    if (!originalText && !changedText) return null;
    return computeDiff(originalText, changedText);
  }, [originalText, changedText, computeDiff]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderLineNumbers = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="min-w-12 border-r border-zinc-700 bg-zinc-800 p-3 select-none">
        {lines.map((_, index) => (
          <div key={index} className="text-right font-mono text-sm leading-6 text-zinc-400">
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderTextArea = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    label: string
  ) => (
    <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <FileTextIcon size={16} />
          {label}
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-400">{value.split("\n").length} lines</span>
          <button
            onClick={() => copyToClipboard(value, label)}
            className="group cursor-pointer rounded p-1.5 transition-colors hover:bg-zinc-600"
            disabled={!value}
            title="Copy to clipboard">
            {copiedStates[label] ? (
              <CheckIcon size={14} className="text-green-600" />
            ) : (
              <CopyIcon size={14} className="text-zinc-400 group-hover:text-zinc-200" />
            )}
          </button>
        </div>
      </div>
      <div className="flex h-80">
        {renderLineNumbers(value || "\n")}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 resize-none overflow-auto bg-zinc-800 p-3 font-mono text-sm leading-6 outline-none"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );

  const renderDiffLine = (line: DiffLine, index: number) => {
    const getLineStyles = () => {
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
            prefix: "",
            prefixColor: "text-gray-400",
          };
      }
    };

    const styles = getLineStyles();

    return (
      <div key={index} className={`flex transition-colors ${styles.bg} ${styles.text}`}>
        <div className="min-w-12 flex-shrink-0 border-r border-zinc-700 bg-zinc-800 p-3 text-right font-mono text-xs text-zinc-400">
          {line.oldLineNumber || ""}
        </div>
        <div className="min-w-12 flex-shrink-0 border-r border-zinc-700 bg-zinc-800 p-3 text-right font-mono text-xs text-zinc-400">
          {line.newLineNumber || ""}
        </div>
        <div className="flex-1 px-4 py-2 font-mono text-sm leading-relaxed">
          <span className={`${styles.prefixColor} mr-2 font-bold`}>{styles.prefix}</span>
          <span className="whitespace-pre-wrap">{line.content}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-3 flex items-center gap-3 text-3xl font-bold">
            <div className="rounded-lg bg-green-100 p-2">
              <GitCompareIcon className="text-green-600" size={24} />
            </div>
            Diff Tool
          </h1>
          <p className="text-zinc-300">
            Compare text changes with smart, GitHub-style diff visualization
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {renderTextArea(
            originalText,
            setOriginalText,
            "Paste your original text here...",
            "Original Text"
          )}
          {renderTextArea(
            changedText,
            setChangedText,
            "Paste your modified text here...",
            "Modified Text"
          )}
        </div>

        {diffResult && diffResult.lines.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
            <div className="border-b border-zinc-700 bg-zinc-900 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <GitCompareIcon size={20} />
                  Diff Analysis
                </h2>
                <div className="flex items-center gap-6 text-sm font-medium">
                  {diffResult.stats.additions > 0 && (
                    <div className="flex items-center justify-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
                      <span className="size-2 rounded-full bg-green-600"></span>
                      <span>+{diffResult.stats.additions} added</span>
                    </div>
                  )}
                  {diffResult.stats.deletions > 0 && (
                    <div className="flex items-center justify-center gap-2 rounded-full bg-red-100 px-3 py-1 text-red-700">
                      <span className="size-2 rounded-full bg-red-600"></span>
                      <span>-{diffResult.stats.deletions} removed</span>
                    </div>
                  )}
                  {diffResult.stats.unchanged > 0 && (
                    <div className="flex items-center justify-center gap-2 rounded-full bg-zinc-700 px-3 py-1">
                      <span className="size-2 rounded-full bg-zinc-200"></span>
                      <span>{diffResult.stats.unchanged} unchanged</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="max-h-[600px] overflow-auto">
              <div className="font-mono text-sm">
                <div className="sticky top-0 flex border-b border-zinc-700 bg-zinc-900 text-xs font-bold">
                  <div className="min-w-12 border-r border-zinc-700 p-3 text-center">Old</div>
                  <div className="min-w-12 border-r border-zinc-700 p-3 text-center">New</div>
                  <div className="flex-1 p-3 px-4">Changes</div>
                </div>
                {diffResult.lines.map(renderDiffLine)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
