type LanguageInfo = {
  label: string;
  extension: string;
};

export const languages: Record<string, LanguageInfo> = {
  bash: { label: "Bash", extension: "sh" },
  c: { label: "C", extension: "c" },
  cpp: { label: "C++", extension: "cpp" },
  csharp: { label: "C#", extension: "cs" },
  css: { label: "CSS", extension: "css" },
  dart: { label: "Dart", extension: "dart" },
  dockerfile: { label: "Dockerfile", extension: "dockerfile" },
  elixir: { label: "Elixir", extension: "ex" },
  go: { label: "Go", extension: "go" },
  html: { label: "HTML", extension: "html" },
  java: { label: "Java", extension: "java" },
  javascript: { label: "JavaScript", extension: "js" },
  json: { label: "JSON", extension: "json" },
  kotlin: { label: "Kotlin", extension: "kt" },
  lua: { label: "Lua", extension: "lua" },
  makefile: { label: "Makefile", extension: "makefile" },
  markdown: { label: "Markdown", extension: "md" },
  perl: { label: "Perl", extension: "pl" },
  php: { label: "PHP", extension: "php" },
  plaintext: { label: "Plain Text", extension: "txt" },
  psql: { label: "PostgreSQL", extension: "sql" },
  python: { label: "Python", extension: "py" },
  ruby: { label: "Ruby", extension: "rb" },
  rust: { label: "Rust", extension: "rs" },
  sql: { label: "SQL", extension: "sql" },
  swift: { label: "Swift", extension: "swift" },
  typescript: { label: "TypeScript", extension: "ts" },
  xml: { label: "XML", extension: "xml" },
  yaml: { label: "YAML", extension: "yml" },
};

export const languageOptions = Object.entries(languages).map(([key, info]) => ({
  label: info.label,
  value: key,
}));
