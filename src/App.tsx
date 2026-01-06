import "@git-diff-view/react/styles/diff-view-pure.css";
import "highlight.js/styles/github-dark.min.css";

import { useEffect, useState } from "react";

import { DiffFile, generateDiffFile } from "@git-diff-view/file";
import { DiffModeEnum, DiffView } from "@git-diff-view/react";

import { languages } from "@/lib/languages";
import { lowlight } from "@/lib/lowlight";
import type { FormElement, MinimalChangeEvent } from "@/types";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/empty";
import Footer from "@/components/footer";
import Header from "@/components/header";
import LanguageDropdown from "@/components/language-dropdown";
import ResultsHeader from "@/components/results-header";
import Switch from "@/components/switch";
import Textarea from "@/components/textarea";

function App() {
  const [diffFile, setDiffFile] = useState<DiffFile | null>(null);
  const [formData, setFormData] = useState({
    values: {
      originalText: "",
      modifiedText: "",
      overrideLanguage: false,
      selectedLanguage: "plaintext",
      liveUpdates: false,
    },
  });

  type FormValues = typeof formData.values;

  function handleChange(e: React.ChangeEvent<FormElement> | MinimalChangeEvent) {
    const { name, value, type } = e.target;
    const fieldName = name as keyof FormValues;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const nextValues = { ...prev.values, [fieldName]: newValue };

      let autoLanguage = nextValues.selectedLanguage;
      const isTextField = fieldName === "originalText" || fieldName === "modifiedText";

      const canAutoDetect =
        !nextValues.overrideLanguage &&
        isTextField &&
        newValue !== "" &&
        nextValues.selectedLanguage === "plaintext";

      if (canAutoDetect && typeof newValue === "string") {
        const result = lowlight.highlightAuto(newValue, {
          subset: Object.keys(languages).filter((key) => key !== "plaintext"),
        });

        const detected = result?.data?.language;

        if (detected) {
          autoLanguage = detected;
        }
      }

      return {
        values: { ...nextValues, selectedLanguage: autoLanguage },
      };
    });
  }

  function handleClearTextarea(id: string) {
    setFormData((prev) => ({
      values: {
        ...prev.values,
        [id]: "",
        selectedLanguage: "plaintext",
      },
    }));
    setDiffFile(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateDiff();
  }

  function updateDiff() {
    if (formData.values.originalText === "" && formData.values.modifiedText === "") {
      setDiffFile(null);
      return;
    }

    if (diffFile && diffFile._oldFileContent === diffFile._newFileContent) return;

    const { selectedLanguage } = formData.values;

    const oldFileName = `old_file.${languages[selectedLanguage].extension}`;
    const newFileName = `new_file.${languages[selectedLanguage].extension}`;
    const oldFileContent = formData.values.originalText || "\n";
    const newFileContent = formData.values.modifiedText || "\n";

    const _file = generateDiffFile(
      oldFileName,
      oldFileContent,
      newFileName,
      newFileContent,
      selectedLanguage,
      selectedLanguage
    );

    const instance = DiffFile.createInstance({
      oldFile: { content: oldFileContent, fileName: oldFileName },
      newFile: { content: newFileContent, fileName: newFileName },
      hunks: _file._diffList,
    });

    instance.initTheme("dark");

    if (oldFileContent !== newFileContent) {
      instance.initRaw();
      instance.buildUnifiedDiffLines();

      setDiffFile(instance);
    } else {
      setDiffFile(null);
    }
  }

  useEffect(() => {
    if (!formData.values.liveUpdates) return;

    updateDiff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.values.liveUpdates, formData.values.modifiedText, formData.values.originalText]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Textarea
                id="originalText"
                value={formData.values.originalText}
                selectedLanguage={formData.values.selectedLanguage}
                label="Original Text"
                placeholder="Paste your original text here..."
                onChange={handleChange}
                onClear={() => handleClearTextarea("originalText")}
              />
              <Textarea
                id="modifiedText"
                value={formData.values.modifiedText}
                selectedLanguage={formData.values.selectedLanguage}
                label="Modified Text"
                placeholder="Paste your modified text here..."
                onChange={handleChange}
                onClear={() => handleClearTextarea("modifiedText")}
              />
            </div>

            <div className="mb-4 grid items-center gap-4 rounded-md border border-zinc-800/50 bg-zinc-900 p-4 sm:grid-cols-2 md:flex">
              <Switch
                id="liveUpdates"
                className="order-0"
                name="liveUpdates"
                label="Live updates"
                checked={formData.values.liveUpdates}
                onChange={handleChange}
              />

              <Switch
                id="overrideLanguage"
                className="-order-1 md:order-0"
                name="overrideLanguage"
                label="Override auto-detect"
                checked={formData.values.overrideLanguage}
                onChange={handleChange}
              />

              <LanguageDropdown
                className="-order-1 sm:order-0"
                selectedLanguage={formData.values.selectedLanguage}
                name="selectedLanguage"
                overrideLanguage={formData.values.overrideLanguage}
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={
                  !formData.values.originalText ||
                  !formData.values.modifiedText ||
                  formData.values.originalText === formData.values.modifiedText ||
                  formData.values.liveUpdates
                }
                className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive order-0 ml-auto inline-flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/20 px-6 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none hover:border-white/10 hover:bg-neutral-900 hover:text-zinc-100 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-4 md:w-auto [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                Compare
              </button>
            </div>
          </form>
        </div>

        {diffFile && (
          <div className="overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
            <ResultsHeader diffFile={diffFile} />
            <DiffView
              diffFile={diffFile}
              diffViewMode={DiffModeEnum.Unified}
              diffViewWrap
              diffViewTheme="dark"
              diffViewHighlight
            />
          </div>
        )}

        {!diffFile && (
          <Empty className="mb-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <svg
                  className="size-12 text-green-600"
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
              </EmptyMedia>
              <EmptyTitle>No differences to show</EmptyTitle>
              <EmptyDescription>
                {formData.values.originalText === "" || formData.values.modifiedText === "" ? (
                  "Enter text in both fields to begin."
                ) : formData.values.originalText === formData.values.modifiedText ? (
                  "The content in both fields is identical."
                ) : (
                  <>
                    <span>Click </span>
                    <code className="rounded-md bg-zinc-800 px-0.75 py-px text-xs">compare</code>
                    <span> to start, or switch on </span>
                    <code className="rounded-md bg-zinc-800 px-0.75 py-px text-xs">
                      live updates
                    </code>
                    <span> for real-time results.</span>
                  </>
                )}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
