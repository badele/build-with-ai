import { BadgeConfig, BadgeField, BadgeStyle } from "../badge/types";
import { DEFAULT_STYLE } from "../badge/theme";
import { computeNaturalDimensions } from "../badge/layout";

const DEFAULT_CONFIG: Omit<BadgeConfig, "style"> = {
  text: "BUILT WITH AI",
  fields: [
    { key: "SPEC", value: "HUMAN+AI" },
    { key: "CODE", value: "AI" },
    { key: "HUMAN EXPERTISE", value: "HIGH" },
  ],
};

function parseColor(raw: string | null, fallback: string): string {
  if (!raw) return fallback;
  const hex = raw.startsWith("#") ? raw : `#${raw}`;
  return /^#[0-9a-fA-F]{3,8}$/.test(hex) ? hex : fallback;
}

function parseNum(raw: string | null, fallback: number, min: number, max: number): number {
  if (!raw) return fallback;
  const n = parseFloat(raw);
  return isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

// Apply migrations for old URL versions so parsing always works against current schema.
// Rule: never rename existing params — add new ones and write a migration if needed.
function migrate(p: URLSearchParams): URLSearchParams {
  const v = parseInt(p.get("v") ?? "1", 10);

  // v1 → v2 example (not yet needed):
  // if (v < 2) {
  //   if (!p.has("new_param") && p.has("old_param")) {
  //     p.set("new_param", p.get("old_param")!);
  //   }
  // }

  void v; // suppress unused warning until first real migration
  return p;
}

export function parseUrl(search: string): BadgeConfig {
  const p = migrate(new URLSearchParams(search));

  const text = p.get("text")?.trim() || DEFAULT_CONFIG.text;

  // Format: "KEY:VALUE" or "KEY:VALUE|keyHex|valueHex"
  const rawFields = p.getAll("f");
  const fields: BadgeField[] = rawFields
    .map((raw) => {
      const [content, rawKc, rawVc] = raw.split("|");
      const idx = content.indexOf(":");
      if (idx === -1) return null;
      const field: BadgeField = {
        key: content.slice(0, idx).trim(),
        value: content.slice(idx + 1).trim(),
      };
      const kc = parseColor(rawKc ?? "", "");
      const vc = parseColor(rawVc ?? "", "");
      if (kc) field.keyColor = kc;
      if (vc) field.valueColor = vc;
      return field;
    })
    .filter((f): f is BadgeField => f !== null);

  const d = DEFAULT_STYLE;
  const resolvedFields = fields.length > 0 ? fields : DEFAULT_CONFIG.fields;

  function parseAlign(raw: string | null, fallback: "left" | "center" | "right"): "left" | "center" | "right" {
    if (raw === "left" || raw === "center" || raw === "right") return raw;
    return fallback;
  }

  const partialStyle = {
    leftZoneWidth: parseNum(p.get("sz_rw"), d.leftZoneWidth, 50, 200),
    topRowHeight:  parseNum(p.get("sz_th"), d.topRowHeight,  28, 100),
    leftZoneScale: parseNum(p.get("sz_rs"), d.leftZoneScale, 0.1,   3),
    titleFontSize: parseNum(p.get("sz_tf"), d.titleFontSize,  10,  40),
    fieldFontSize: parseNum(p.get("sz_ff"), d.fieldFontSize,   8,  24),
    titleAlign:    parseAlign(p.get("al_t"), d.titleAlign),
    fieldAlign:    parseAlign(p.get("al_f"), d.fieldAlign),
    ...(p.get("svg") ? { customSvg: p.get("svg")! } : {}),
    bg:            parseColor(p.get("c_bg"),  d.bg),
    leftGradStart: parseColor(p.get("c_rgs"), d.leftGradStart),
    leftGradEnd:   parseColor(p.get("c_rge"), d.leftGradEnd),
    titleGradStart: parseColor(p.get("c_tgs"), d.titleGradStart),
    titleGradEnd:   parseColor(p.get("c_tge"), d.titleGradEnd),
  };

  const rawW = p.get("sz_w");
  const rawH = p.get("sz_h");
  const natural = computeNaturalDimensions({
    text,
    fields: resolvedFields,
    style: { ...d, ...partialStyle },
  });
  const style: BadgeStyle = {
    ...partialStyle,
    width:  rawW ? parseNum(rawW, natural.width,  100, 1200) : natural.width,
    height: rawH ? parseNum(rawH, natural.height,  20,  400) : natural.height,
  };

  return {
    text,
    fields: resolvedFields,
    style,
  };
}
