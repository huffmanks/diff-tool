import { languageOptions } from "@/lib/languages";
import type { MinimalChangeEvent } from "@/types";

interface LanguageDropdownProps {
  selectedLanguage: string;
  name: string;
  overrideLanguage: boolean;
  className?: string;
  onChange: (e: MinimalChangeEvent) => void;
}

export default function LanguageDropdown({
  selectedLanguage,
  name,
  overrideLanguage,
  className,
  onChange,
}: LanguageDropdownProps) {
  function handleSelect(value: string) {
    onChange({
      target: { name, value },
    });

    const popover = document.getElementById("language-dropdown");
    popover?.hidePopover();
  }

  const selectedLanguageLabel = languageOptions.find(
    (opt) => opt.value === selectedLanguage
  )?.label;

  return (
    <div className={className}>
      <button
        id="language-dropdown-btn-show"
        type="button"
        disabled={!overrideLanguage}
        className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex h-10 w-full shrink-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-white/20 px-6 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none hover:border-white/10 hover:bg-neutral-900 hover:text-zinc-100 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:pr-2 has-[>svg]:pl-3 md:w-36 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        popoverTarget="language-dropdown"
        popoverTargetAction="show"
        aria-label="Open language select"
        aria-controls="language-dropdown"
        aria-haspopup="listbox">
        <span>{selectedLanguageLabel}</span>
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <nav
        id="language-dropdown"
        popover=""
        className="scrollbar h-48 w-36 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900">
        <div className="popover-menu relative">
          <div
            role="listbox"
            className="flex flex-col gap-1 py-1">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                role="option"
                type="button"
                aria-selected={selectedLanguage === option.value}
                className={`cursor-pointer rounded-md px-2 py-1 text-left text-zinc-50 transition-colors ${selectedLanguage === option.value ? "bg-neutral-700 text-white" : "hover:bg-neutral-700"}`}
                onClick={() => handleSelect(option.value)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
