import { useState, useRef } from "react";

interface Props {
  value: string | undefined;
  onChange: (svg: string | undefined) => void;
}

type Tab = "paste" | "url" | "file";

export function SvgImport({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("paste");
  const [pasteText, setPasteText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function applyPaste() {
    const trimmed = pasteText.trim();
    if (trimmed) {
      onChange(trimmed);
      setPasteText("");
    }
  }

  async function loadUrl() {
    const url = urlText.trim();
    if (!url) return;
    setLoading(true);
    setUrlError("");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      onChange(text.trim());
      setUrlText("");
    } catch (e) {
      setUrlError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") onChange(text.trim());
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "paste", label: "Paste" },
    { id: "url",   label: "URL"   },
    { id: "file",  label: "File"  },
  ];

  return (
    <div className="svg-import">
      {value && (
        <div className="svg-import-preview">
          <div
            className="svg-import-thumb"
            dangerouslySetInnerHTML={{ __html: value }}
          />
          <button
            className="svg-import-remove"
            title="Remove custom SVG"
            onClick={() => onChange(undefined)}
          >
            ↺
          </button>
        </div>
      )}

      <div className="svg-import-tabs">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            className={`svg-tab-btn${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "paste" && (
        <div className="svg-import-body">
          <textarea
            className="svg-paste"
            placeholder={"<svg xmlns=\"http://www.w3.org/2000/svg\" ...>\n  ...\n</svg>"}
            value={pasteText}
            rows={4}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <p className="svg-paste-hint">
            Tip: copy SVG code from the editor on{" "}
            <a href="https://www.svgrepo.com/" target="_blank" rel="noreferrer">
              svgrepo.com
            </a>{" "}
            (open an icon → Edit SVG → select all &amp; copy).
          </p>
          <button
            className="svg-apply-btn"
            onClick={applyPaste}
            disabled={!pasteText.trim()}
          >
            Apply
          </button>
        </div>
      )}

      {tab === "url" && (
        <div className="svg-import-body">
          <div className="svg-url-row">
            <input
              className="svg-url-input"
              type="url"
              placeholder="https://..."
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadUrl()}
            />
            <button
              className="svg-apply-btn"
              onClick={loadUrl}
              disabled={loading || !urlText.trim()}
            >
              {loading ? "…" : "Load"}
            </button>
          </div>
          {urlError && <div className="svg-error">{urlError}</div>}
        </div>
      )}

      {tab === "file" && (
        <div className="svg-import-body">
          <input
            ref={fileRef}
            type="file"
            accept=".svg,image/svg+xml"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          <button
            className="svg-apply-btn full"
            onClick={() => fileRef.current?.click()}
          >
            Choose .svg file
          </button>
        </div>
      )}
    </div>
  );
}
