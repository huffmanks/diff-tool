import Editor from "@monaco-editor/react";
import * as Diff from "diff";
import { useRef, useState, type ChangeEvent } from "react";

const getLangFromFilename = (filename: string) => {
  const ext = filename.split(".").pop();
  const map: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    rb: "ruby",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    md: "markdown",
    txt: "plaintext",
  };
  return ext && map[ext] ? map[ext] : "plaintext";
};

export default function App() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const [originalLang, setOriginalLang] = useState("plaintext");
  const [changedLang, setChangedLang] = useState("plaintext");
  const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
  const [viewMode, setViewMode] = useState<"split" | "unified">("unified");
  const fileInputOriginal = useRef(null);
  const fileInputChanged = useRef(null);

  const handleCompare = () => {
    const diff = Diff.diffLines(original, changed);
    setDiffResult(diff);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, setText: (text: string) => void, setLang: (lang: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setText(result);
      }
    };
    setLang(getLangFromFilename(file.name));
    reader.readAsText(file);
  };

  const handleEditorChange = (val: string, setText: (text: string) => void, setLang: (lang: string) => void) => {
    setText(val || "");
    if (val) {
      if (val.trim().startsWith("<!DOCTYPE html") || val.includes("<html")) setLang("html");
      else if (val.includes("function") || val.includes("const")) setLang("javascript");
      else if (val.includes("def ") || val.includes("import ")) setLang("python");
      else setLang("plaintext");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button onClick={() => setViewMode("unified")} className={`px-3 py-1 rounded mr-2 ${viewMode === "unified" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            Unified View
          </button>
          <button onClick={() => setViewMode("split")} className={`px-3 py-1 rounded ${viewMode === "split" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            Split View
          </button>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleCompare}>
          Compare
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold mb-2">Original</h2>
          <input
            type="file"
            accept=".txt,.js,.ts,.py,.rb,.java,.cpp,.c,.cs,.html,.css,.json,.xml,.md"
            ref={fileInputOriginal}
            onChange={(e) => handleFileUpload(e, setOriginal, setOriginalLang)}
            className="mb-2"
          />
          <Editor height="300px" language={originalLang} value={original} onChange={(val) => handleEditorChange(val ?? "plaintext", setOriginal, setOriginalLang)} options={{ lineNumbers: "on" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Changed</h2>
          <input
            type="file"
            accept=".txt,.js,.ts,.py,.rb,.java,.cpp,.c,.cs,.html,.css,.json,.xml,.md"
            ref={fileInputChanged}
            onChange={(e) => handleFileUpload(e, setChanged, setChangedLang)}
            className="mb-2"
          />
          <Editor height="300px" language={changedLang} value={changed} onChange={(val) => handleEditorChange(val ?? "plaintext", setChanged, setChangedLang)} options={{ lineNumbers: "on" }} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Diff Output</h2>
        {viewMode === "unified" ? (
          <pre className="bg-gray-100 p-4 overflow-auto whitespace-pre-wrap">
            {diffResult.map((part, i) => (
              <span key={i} className={part.added ? "text-green-600" : part.removed ? "text-red-600" : "text-gray-800"}>
                {part.value}
              </span>
            ))}
          </pre>
        ) : (
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-4 text-sm">
            <div>
              {diffResult.map((part, i) => (
                <div key={i} className={part.removed ? "text-red-600" : "text-gray-800"}>
                  {part.removed || (!part.added && part.value.trim()) ? part.value : ""}
                </div>
              ))}
            </div>
            <div>
              {diffResult.map((part, i) => (
                <div key={i} className={part.added ? "text-green-600" : "text-gray-800"}>
                  {part.added || (!part.removed && part.value.trim()) ? part.value : ""}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
