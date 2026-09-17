import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { BadgeConfig } from "./badge/types";
import { generateBadge } from "./badge/generate";
import { parseUrl } from "./url/parse";
import { serializeUrl } from "./url/serialize";
import { FieldList } from "./ui/FieldList";
import { BadgePreview } from "./ui/BadgePreview";
import { ActionBar } from "./ui/ActionBar";
import { StylePanel } from "./ui/StylePanel";

function App() {
  const [config, setConfig] = useState<BadgeConfig>(() =>
    parseUrl(window.location.search),
  );

  const svg = generateBadge(config);

  useEffect(() => {
    const query = serializeUrl(config);
    history.replaceState(null, "", query);
  }, [config]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>built<br/>with ai.</h1>
        <p className="app-subtitle">
          <strong>Own your AI usage — transparently.</strong>{" "}
          Generate a README badge that declares exactly how AI was involved in your project:
          spec, code, review, human expertise level. Because assuming it is better than hiding it.
        </p>
      </header>

      <main className="app-main">
        <div className="output-panel">
          <BadgePreview svg={svg} />
          <ActionBar svg={svg} config={config} />
        </div>

        <div className="editor-panel">
          <div className="form-group">
            <label className="section-label" htmlFor="main-text">
              Main text
            </label>
            <input
              id="main-text"
              className="text-input"
              value={config.text}
              placeholder="BUILT WITH AI"
              maxLength={60}
              onChange={(e) =>
                setConfig((c) => ({ ...c, text: e.target.value }))
              }
            />
          </div>

          <FieldList
            fields={config.fields}
            onChange={(fields) => setConfig((c) => ({ ...c, fields }))}
          />

          <StylePanel
            style={config.style}
            onChange={(style) => setConfig((c) => ({ ...c, style }))}
          />
        </div>
      </main>
    </div>
  );
}

const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
