export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-7xl p-6">
      <div className="border-t border-neutral-700 py-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-neutral-400">
              <span>{currentYear} | </span>
              <a
                className="text-xs underline hover:text-neutral-300 hover:decoration-2 focus:decoration-2 focus:outline-hidden"
                href="https://huffmanks.com"
                target="_blank"
                rel="noopener">
                Kevin Huffman
              </a>
            </p>
          </div>
          <ul className="flex flex-wrap items-center">
            <li className="relative inline-block pe-4 text-xs text-neutral-500 before:absolute before:end-1.5 before:top-1/2 before:size-0.75 before:-translate-y-1/2 before:rounded-full before:bg-neutral-600 last:pe-0 last-of-type:before:hidden">
              <a
                className="text-xs text-neutral-500 underline hover:text-neutral-400 hover:decoration-2 focus:decoration-2 focus:outline-hidden"
                href="https://github.com/huffmanks"
                target="_blank"
                rel="noopener">
                GitHub
              </a>
            </li>
            <li className="relative inline-block pe-4 text-xs text-neutral-500 before:absolute before:end-1.5 before:top-1/2 before:size-0.75 before:-translate-y-1/2 before:rounded-full before:bg-neutral-600 last:pe-0 last-of-type:before:hidden">
              <a
                className="text-xs text-neutral-500 underline hover:text-neutral-400 hover:decoration-2 focus:decoration-2 focus:outline-hidden"
                href="https://www.linkedin.com/in/huffmanks"
                target="_blank"
                rel="noopener">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
