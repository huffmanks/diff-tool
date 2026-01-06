import { useRef } from "react";

import { cn } from "@/lib/utils";

interface SwitchProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Switch({ id, name, label, checked, className, onChange }: SwitchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const state = checked ? "checked" : "unchecked";

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    inputRef.current?.click();
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={state}
        className="peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-100 data-[state=unchecked]:bg-zinc-800"
        onClick={handleClick}>
        <span
          data-state={state}
          className="pointer-events-none block size-4 rounded-full bg-zinc-950 ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=unchecked]:bg-zinc-100"></span>
      </button>
      <label
        className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
