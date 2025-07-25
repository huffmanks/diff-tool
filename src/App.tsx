import * as Diff from "diff";
import { useCallback, useMemo, useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import Results from "./components/results";
import ResultsHeader from "./components/results/header";
import Textarea from "./components/textarea";
import type { DiffLine, DiffResult } from "./types";
import { calculateSimilarity } from "./utils";

export default function App() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");

  const computeDiff = useCallback((original: string, changed: string): DiffResult => {
    const originalLines = original.split("\n");
    const changedLines = changed.split("\n");

    const lineDiff = Diff.diffArrays(originalLines, changedLines);
    const diffLines: DiffLine[] = [];
    let totalAdditions = 0;
    let totalDeletions = 0;
    let totalUnchanged = 0;
    let oldLineNumber = 1;
    let newLineNumber = 1;

    let i = 0;
    while (i < lineDiff.length) {
      const part = lineDiff[i];

      if (part.added) {
        for (const line of part.value) {
          diffLines.push({
            type: "added",
            content: line,
            oldLineNumber: undefined,
            newLineNumber: newLineNumber,
          });
          totalAdditions++;
          newLineNumber++;
        }
        i++;
      } else if (part.removed) {
        const nextPart = i + 1 < lineDiff.length ? lineDiff[i + 1] : null;

        if (nextPart && nextPart.added && part.value.length === nextPart.value.length) {
          for (let j = 0; j < part.value.length; j++) {
            const removedLine = part.value[j];
            const addedLine = nextPart.value[j];

            if (calculateSimilarity(removedLine, addedLine) > 0.6) {
              const charDiff = Diff.diffSentences(removedLine, addedLine);
              let inlineContent = "";

              for (const charPart of charDiff) {
                if (charPart.added) {
                  inlineContent += `<span class="mr-[1ch] bg-green-950 text-green-200">${charPart.value}</span>`;
                } else if (charPart.removed) {
                  inlineContent += `<span class="mr-[1ch] bg-red-950 text-red-200 line-through">${charPart.value}</span>`;
                } else {
                  inlineContent += charPart.value;
                }
              }

              diffLines.push({
                type: "unchanged",
                content: inlineContent,
                oldLineNumber: oldLineNumber,
                newLineNumber: newLineNumber,
                isInlineDiff: true,
              });

              totalAdditions++;
              totalDeletions++;
            } else {
              diffLines.push({
                type: "removed",
                content: removedLine,
                oldLineNumber: oldLineNumber,
                newLineNumber: undefined,
              });
              diffLines.push({
                type: "added",
                content: addedLine,
                oldLineNumber: undefined,
                newLineNumber: newLineNumber,
              });

              totalDeletions++;
              totalAdditions++;
            }

            oldLineNumber++;
            newLineNumber++;
          }

          i += 2;
        } else {
          for (const line of part.value) {
            diffLines.push({
              type: "removed",
              content: line,
              oldLineNumber: oldLineNumber,
              newLineNumber: undefined,
            });
            totalDeletions++;
            oldLineNumber++;
          }
          i++;
        }
      } else {
        for (const line of part.value) {
          diffLines.push({
            type: "unchanged",
            content: line,
            oldLineNumber: oldLineNumber,
            newLineNumber: newLineNumber,
          });
          totalUnchanged++;
          oldLineNumber++;
          newLineNumber++;
        }
        i++;
      }
    }

    return {
      lines: diffLines,
      stats: {
        additions: totalAdditions,
        deletions: totalDeletions,
        unchanged: totalUnchanged,
      },
    };
  }, []);

  const diffResult = useMemo(() => {
    if (!originalText && !modifiedText) return null;
    return computeDiff(originalText, modifiedText);
  }, [originalText, modifiedText, computeDiff]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6">
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Textarea
            value={originalText}
            setValue={setOriginalText}
            label="Original Text"
            placeholder="Paste your original text here..."
            onChange={setOriginalText}
          />
          <Textarea
            value={modifiedText}
            setValue={setModifiedText}
            label="Modified Text"
            placeholder="Paste your modified text here..."
            onChange={setModifiedText}
          />
        </div>

        {diffResult && diffResult.lines.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
            <ResultsHeader diffResult={diffResult} />
            <Results diffResult={diffResult} />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
