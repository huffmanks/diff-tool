import { CheckIcon, CopyIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export default function Textarea({ value, onChange, placeholder, label }: Props) {
  const [isCopying, setIsCopying] = useState(false);

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
      <div className="flex h-80">
        <LineNumbers content={value || ""} />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="scrollbar flex-1 resize-none bg-zinc-800 py-3 pr-5 pl-3 font-mono text-sm leading-6 outline-none"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

function LineNumbers({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="min-w-12 border-r border-zinc-700 bg-zinc-800 p-3 select-none">
      {lines.map((_, index) => (
        <div key={index} className="text-right font-mono text-sm leading-6 text-zinc-400">
          {index + 1}
        </div>
      ))}
    </div>
  );
}
