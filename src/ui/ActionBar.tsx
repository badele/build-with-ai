import { useState } from "react";
import { downloadSvg, downloadPng, copySvg, copyUrl } from "../export/svg";
import { BadgeConfig } from "../badge/types";
import { serializeUrl } from "../url/serialize";

interface Props {
  svg: string;
  config: BadgeConfig;
}

type CopyState = "idle" | "copied-url" | "copied-svg";

export function ActionBar({ svg, config }: Props) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [pngScale, setPngScale] = useState<number>(1);

  async function handleCopyUrl() {
    const url =
      window.location.origin +
      window.location.pathname +
      serializeUrl(config);
    await copyUrl(url);
    setCopyState("copied-url");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  async function handleCopySvg() {
    await copySvg(svg);
    setCopyState("copied-svg");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  return (
    <div className="action-bar">
      <button className="btn-action" onClick={handleCopyUrl}>
        {copyState === "copied-url" ? "✓ Copied!" : "Copy URL"}
      </button>
      <button className="btn-action" onClick={handleCopySvg}>
        {copyState === "copied-svg" ? "✓ Copied!" : "Copy SVG"}
      </button>
      <button className="btn-action" onClick={() => downloadSvg(svg)}>
        Download SVG
      </button>
      <div className="btn-png-group">
        <button
          className="btn-action btn-primary"
          onClick={() => downloadPng(svg, "built-with-ai.png", pngScale)}
        >
          Download PNG
        </button>
        <select
          className="png-scale-select"
          value={pngScale}
          onChange={(e) => setPngScale(Number(e.target.value))}
          title="PNG scale factor"
        >
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={3}>3×</option>
        </select>
      </div>
    </div>
  );
}
