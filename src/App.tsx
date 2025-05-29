import * as Diff from "diff";
import { useCallback, useMemo, useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import Results from "./components/results";
import ResultsHeader from "./components/results/header";
import Textarea from "./components/textarea";
import type { DiffLine, DiffResult } from "./types";

export default function App() {
  const [originalText, setOriginalText] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.\nSequi asperiores ad iure repellendus inventore, quasi quidem totam corrupti exercitationem voluptatem error eius veniam magnam laboriosam blanditiis saepe autem nobis incidunt laudantium, facilis doloribus beatae sunt nemo.\nCumque error mollitia laborum tempore sapiente fugit saepe blanditiis similique fuga impedit, obcaecati beatae libero."
  );
  const [modifiedText, setModifiedText] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.\nDebitis aliquam quas voluptate nemo explicabo, tenetur eaque officiis quasi dicta aliquid vel eos molestias consequuntur, ab nisi soluta consequatur mollitia nulla consectetur molestiae illum recusandae excepturi.\nCumque error mollitia laborum tempore sapiente fugit saepe blanditiis similique fuga impedit, obcaecati beatae libero."
  );

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
        // Check if next part is added and can be merged as inline diff
        const nextPart = i + 1 < lineDiff.length ? lineDiff[i + 1] : null;

        if (nextPart && nextPart.added && part.value.length === nextPart.value.length) {
          // Try to create inline diffs for each line pair
          for (let j = 0; j < part.value.length; j++) {
            const removedLine = part.value[j];
            const addedLine = nextPart.value[j];

            if (calculateSimilarity(removedLine, addedLine) > 0.6) {
              // Create inline diff
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
              // Lines are too different, treat as separate removed/added
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

          i += 2; // Skip both current and next part as we've processed them
        } else {
          // No matching added part, treat as pure removal
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
        // Unchanged lines
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

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

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
