export default function Header() {
  return (
    <header className="mx-auto mb-8 max-w-7xl px-6 pt-6">
      <h1 className="mb-3 flex items-center gap-3 text-3xl font-bold">
        <svg
          className="size-9 text-green-600"
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
        <span>Diff Tool</span>
      </h1>
      <p className="text-zinc-300">Compare text changes with side-by-side diff visualization.</p>
    </header>
  );
}
