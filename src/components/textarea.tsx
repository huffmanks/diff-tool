import { forwardRef, useMemo, useRef, useState } from "react";

import { toHtml } from "hast-util-to-html";

import { languages } from "@/lib/languages";
import { lowlight } from "@/lib/lowlight";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  value: string;
  selectedLanguage: string;
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
}

export default function Textarea({
  id,
  value,
  selectedLanguage,
  label,
  placeholder,
  onChange,
  onClear,
}: Props) {
  const [isCopying, setIsCopying] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;

      requestAnimationFrame(() => {
        if (lineNumbersRef.current) {
          lineNumbersRef.current.scrollTop = scrollTop;
        }
        if (highlightRef.current) {
          highlightRef.current.scrollTop = scrollTop;
          highlightRef.current.scrollLeft = scrollLeft;
        }
      });
    }
  }

  const highlightedCode = useMemo(() => {
    if (!value) return "";
    if (selectedLanguage === "plaintext" || !languages[selectedLanguage]) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    try {
      const tree = lowlight.highlight(selectedLanguage, value);
      return toHtml(tree);
    } catch {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }, [value, selectedLanguage]);

  function handleClear() {
    setIsClearing(true);

    onClear();

    setTimeout(() => {
      setIsClearing(false);
    }, 1000);
  }

  async function handleCopyToClipboard() {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    }
  }

  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 py-3 pr-2 pl-4">
        <h3 className="flex items-center gap-3 font-semibold">
          <svg
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
          {label}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{value.split("\n").length} lines</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleClear}
              className="group rounded p-1.5 transition-colors enabled:cursor-pointer enabled:hover:bg-zinc-600"
              disabled={!value}
              title="Clear textarea">
              <svg
                className={cn(
                  "size-3.5",
                  isClearing
                    ? "text-red-600"
                    : "text-zinc-300 group-disabled:text-zinc-600 enabled:group-hover:text-zinc-100"
                )}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="m8.464 7.05l8.486 8.486L13.485 19H20a1 1 0 1 1 0 2H8.893a1.5 1.5 0 0 1-1.06-.44l-5.026-5.024a2 2 0 0 1 0-2.829zm7.071-4.242l5.657 5.656a2 2 0 0 1 0 2.829l-2.828 2.828l-8.485-8.485l2.828-2.828a2 2 0 0 1 2.828 0"
                  />
                </g>
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="group rounded p-1.5 transition-colors enabled:cursor-pointer enabled:hover:bg-zinc-600"
              disabled={!value}
              title="Copy to clipboard">
              <svg
                className={cn(
                  "size-3.5",
                  isCopying
                    ? "text-green-600"
                    : "text-zinc-300 group-disabled:text-zinc-600 enabled:group-hover:text-zinc-100"
                )}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect
                  width="14"
                  height="14"
                  x="8"
                  y="8"
                  rx="2"
                  ry="2"
                />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="scrollbar relative flex h-80">
        <LineNumbers
          ref={lineNumbersRef}
          content={value || ""}
        />

        <pre
          ref={highlightRef}
          aria-hidden="true"
          className="hljs pointer-events-none absolute top-0 right-0 bottom-0 left-14 overflow-hidden bg-zinc-800 py-3 pr-5 pl-3 font-mono text-sm leading-6 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightedCode + "\n" }}
          style={{ backgroundColor: "var(--color-zinc-800) !important" }}
        />
        <textarea
          id={id}
          name={id}
          ref={textareaRef}
          value={value}
          placeholder={placeholder}
          spellCheck={false}
          className="absolute top-0 right-0 bottom-0 left-14 z-10 resize-none bg-transparent py-3 pr-5 pl-3 font-mono text-sm leading-6 whitespace-pre-wrap text-transparent caret-white outline-none selection:bg-zinc-500/30"
          onChange={onChange}
          onScroll={handleScroll}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

const LineNumbers = forwardRef<HTMLDivElement, { content: string }>(({ content }, ref) => {
  const lines = content.split("\n");
  return (
    <div
      ref={ref}
      className="h-80 overflow-hidden bg-zinc-800 py-3">
      {lines.map((line, index) => (
        <div
          key={index}
          className="flex pr-5">
          <span className="inline-block w-14 border-r border-zinc-700 px-3 text-right font-mono text-sm leading-6 text-zinc-400">
            {index + 1}
          </span>
          <span className="pointer-events-none -z-10 inline-block w-full pl-3 font-mono text-sm leading-6 opacity-0 select-none">
            {line || "\u00A0"}
          </span>
        </div>
      ))}
    </div>
  );
});
