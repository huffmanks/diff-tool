import { GitCompareIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="mx-auto mb-8 max-w-7xl px-6 pt-6">
      <h1 className="mb-3 flex items-center gap-3 text-3xl font-bold">
        <div className="rounded-lg bg-green-100 p-2">
          <GitCompareIcon className="text-green-600" size={24} />
        </div>
        Diff Tool
      </h1>
      <p className="text-zinc-300">Compare text changes with side-by-side diff visualization.</p>
    </header>
  );
}
