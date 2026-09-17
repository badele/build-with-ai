import { BadgeConfig } from "./types";
import { COLORS, FONT_FAMILY, SIZES } from "./theme";
import { LEFT_ZONE_SVG_PATHS, LEFT_ZONE_STROKE_WIDTH } from "./leftzone";
import { computeLayout } from "./layout";

// Generate a hash string based on the badge config, used for unique IDs in the SVG.
function configHash(config: BadgeConfig): string {
  const styleStr = Object.values(config.style).join("");
  const s =
    config.text + config.fields.map((f) => f.key + f.value).join("") + styleStr;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).slice(0, 6);
}

// Center the left-zone icon and apply scale.
// Default paths are drawn centered at (50, 29.5) in their own coordinate space.
// The left zone spans the full badge height (left column), so we center on height/2.
function leftZoneTransform(scale: number, lz: number, height: number): string {
  const cx = lz / 2;
  const cy = height / 2;
  const s = Math.round(scale * 1000) / 1000;
  return `translate(${cx}, ${cy}) scale(${s}) translate(-50, -29.5)`;
}

// Extract viewBox and inner content from a custom SVG string.
function parseCustomSvg(svgText: string): {
  viewBox: string;
  cx: number;
  cy: number;
  inner: string;
} {
  const vbMatch = svgText.match(/\bviewBox="([^"]+)"/i);
  const wMatch = svgText.match(/\bwidth="([\d.]+)"/i);
  const hMatch = svgText.match(/\bheight="([\d.]+)"/i);
  const viewBox =
    vbMatch?.[1] ??
    (wMatch && hMatch ? `0 0 ${wMatch[1]} ${hMatch[1]}` : "0 0 100 100");
  const [vx, vy, vw, vh] = viewBox.split(/[\s,]+/).map(Number);
  const cx = (vx ?? 0) + (vw ?? 100) / 2;
  const cy = (vy ?? 0) + (vh ?? 100) / 2;
  const inner = svgText.replace(/<\/?svg[^>]*>/gi, "").trim();
  return { viewBox, cx, cy, inner };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFieldLine(fields: BadgeConfig["fields"]): string {
  const parts: string[] = [];
  for (let i = 0; i < fields.length; i++) {
    const { key, value, keyColor, valueColor } = fields[i];
    if (i > 0) {
      parts.push(`<tspan fill="${COLORS.dotText}" dx="5">&#xb7;</tspan>`);
    }
    const keyDx = i > 0 ? ` dx="5"` : "";
    const kc = esc(keyColor ?? COLORS.keyText);
    const vc = esc(valueColor ?? COLORS.valueText);
    parts.push(
      `<tspan fill="${kc}"${keyDx}>${esc(key)}</tspan>` +
        `<tspan fill="${vc}" dx="4">${esc(value)}</tspan>`,
    );
  }
  return parts.join("");
}

export function generateBadge(config: BadgeConfig): string {
  const { style } = config;
  const id = `b${configHash(config)}`;
  const layout = computeLayout(config);
  const { width, height, topRowHeight, bottomRowHeight, fieldLines } = layout;
  const lz = style.leftZoneWidth;
  const rx = SIZES.borderRadius;

  const textZoneLeft = lz + SIZES.padH;
  const textZoneRight = width - SIZES.padH;
  const textZoneCenter = lz + (width - lz) / 2;

  function textX(align: "left" | "center" | "right"): number {
    if (align === "right") return textZoneRight;
    if (align === "center") return textZoneCenter;
    return textZoneLeft;
  }

  const titleX = textX(style.titleAlign);
  const titleAnchor =
    style.titleAlign === "right"
      ? "end"
      : style.titleAlign === "center"
        ? "middle"
        : "start";
  const titleY = topRowHeight / 2;

  const fieldAnchor =
    style.fieldAlign === "right"
      ? "end"
      : style.fieldAlign === "center"
        ? "middle"
        : "start";
  const fieldX = textX(style.fieldAlign);

  const hSep =
    fieldLines.length > 0
      ? `<line x1="${lz + 4}" y1="${topRowHeight}" x2="${width - 4}" y2="${topRowHeight}" stroke="${COLORS.separatorLine}" stroke-width="1"/>`
      : "";

  const fieldTexts = fieldLines
    .map((line, i) => {
      const y = topRowHeight + i * bottomRowHeight + bottomRowHeight / 2;
      return (
        `<text x="${fieldX}" y="${y}" ` +
        `font-family="${FONT_FAMILY}" font-size="${style.fieldFontSize}" ` +
        `dominant-baseline="middle" text-anchor="${fieldAnchor}">` +
        renderFieldLine(line) +
        `</text>`
      );
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="${id}-c">
      <rect width="${width}" height="${height}" rx="${rx}"/>
    </clipPath>
    <clipPath id="${id}-lz">
      <rect width="${lz}" height="${height}"/>
    </clipPath>
    <linearGradient id="${id}-g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${esc(style.leftGradStart)}"/>
      <stop offset="1" stop-color="${esc(style.leftGradEnd)}"/>
    </linearGradient>
    <linearGradient id="${id}-g2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${esc(style.titleGradStart)}"/>
      <stop offset="1" stop-color="${esc(style.titleGradEnd)}"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#${id}-c)">
    <rect width="${width}" height="${height}" fill="${esc(style.bg)}"/>
    <rect width="${lz}" height="${height}" fill="url(#${id}-g1)"/>
    ${hSep}
    <g clip-path="url(#${id}-lz)">${
      style.customSvg
        ? (() => {
            const { viewBox, cx, cy, inner } = parseCustomSvg(style.customSvg);
            const s = Math.round(style.leftZoneScale * 1000) / 1000;
            const scaleTransform =
              s !== 1
                ? ` transform="translate(${cx},${cy}) scale(${s}) translate(${-cx},${-cy})"`
                : "";
            return `<svg x="0" y="0" width="${lz}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet"><g${scaleTransform}>${inner}</g></svg>`;
          })()
        : `<g transform="${leftZoneTransform(style.leftZoneScale, lz, height)}" stroke="#ffffff" fill="none" stroke-width="${LEFT_ZONE_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">${LEFT_ZONE_SVG_PATHS}</g>`
    }</g>
    <text x="${titleX}" y="${titleY}" font-family="${FONT_FAMILY}" font-size="${style.titleFontSize}" font-weight="800" fill="url(#${id}-g2)" dominant-baseline="middle" text-anchor="${titleAnchor}">${esc(config.text)}</text>
    ${fieldTexts}
  </g>
  <rect width="${width}" height="${height}" rx="${rx}" fill="none" stroke="${COLORS.borderStroke}" stroke-width="1.5"/>
</svg>`;
}
