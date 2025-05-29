import * as Diff from "diff";
import { useCallback, useMemo, useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import Results from "./components/results";
import ResultsHeader from "./components/results/header";
import Textarea from "./components/textarea";
import type { DiffLine, DiffResult } from "./types";

export default function App() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");

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
            label="Original Text"
            placeholder="Paste your original text here..."
            onChange={setOriginalText}
          />
          <Textarea
            value={modifiedText}
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
