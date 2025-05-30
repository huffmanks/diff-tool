import { CheckIcon, CopyIcon, FileTextIcon } from "lucide-react";
import { forwardRef, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export default function Textarea({ value, onChange, placeholder, label }: Props) {
  const [isCopying, setIsCopying] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
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
      }, 2000);
    }
  }

  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 py-3 pr-2 pl-4">
        <h3 className="flex items-center gap-3 font-semibold">
          <FileTextIcon size={20} />
          {label}
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-400">{value.split("\n").length} lines</span>
          <button
            onClick={handleCopyToClipboard}
            className="group cursor-pointer rounded p-1.5 transition-colors hover:bg-zinc-600"
            disabled={!value}
            title="Copy to clipboard">
            {isCopying ? (
              <CheckIcon size={14} className="text-green-600" />
            ) : (
              <CopyIcon size={14} className="text-zinc-400 group-hover:text-zinc-200" />
            )}
          </button>
        </div>
      </div>
      <div className="scrollbar relative flex h-80">
        <LineNumbers ref={lineNumbersRef} content={value || ""} />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="absolute top-0 right-0 bottom-0 left-14 z-10 resize-none bg-zinc-800 py-3 pr-5 pl-3 font-mono text-sm leading-6 outline-none"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

const LineNumbers = forwardRef<HTMLDivElement, { content: string }>(({ content }, ref) => {
  const lines = content.split("\n");
  return (
    <div ref={ref} className="h-80 overflow-hidden bg-zinc-800 py-3">
      {lines.map((line, index) => (
        <div key={index} className="flex pr-5">
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
