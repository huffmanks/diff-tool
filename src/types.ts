export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
  isInlineDiff?: boolean;
}

export interface DiffResult {
  lines: DiffLine[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}
