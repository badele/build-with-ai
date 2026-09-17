import { BadgeConfig, BadgeStyle } from "../badge/types";
import { DEFAULT_STYLE } from "../badge/theme";

type StyleKey = keyof BadgeStyle;

const NUM_KEYS: Array<[StyleKey, string]> = [
  ["leftZoneWidth", "sz_rw"],
  ["topRowHeight",  "sz_th"],
  ["leftZoneScale", "sz_rs"],
  ["titleFontSize", "sz_tf"],
  ["fieldFontSize", "sz_ff"],
];

const COLOR_KEYS: Array<[StyleKey, string]> = [
  ["bg",             "c_bg"],
  ["leftGradStart",  "c_rgs"],
  ["leftGradEnd",    "c_rge"],
  ["titleGradStart", "c_tgs"],
  ["titleGradEnd",   "c_tge"],
];

const URL_VERSION = 1;

export function serializeUrl(config: BadgeConfig): string {
  const params = new URLSearchParams();
  params.set("v", String(URL_VERSION));
  params.set("text", config.text);
  for (const { key, value, keyColor, valueColor } of config.fields) {
    let entry = `${key}:${value}`;
    if (keyColor || valueColor) {
      entry += `|${(keyColor ?? "").replace("#", "")}|${(valueColor ?? "").replace("#", "")}`;
    }
    params.append("f", entry);
  }

  const d = DEFAULT_STYLE;
  const s = config.style;

  params.set("sz_w", String(s.width));
  params.set("sz_h", String(s.height));

  if (s.customSvg) params.set("svg", s.customSvg);
  if (s.titleAlign !== d.titleAlign) params.set("al_t", s.titleAlign);
  if (s.fieldAlign !== d.fieldAlign) params.set("al_f", s.fieldAlign);

  for (const [key, param] of NUM_KEYS) {
    if (s[key] !== d[key]) params.set(param, String(s[key]));
  }
  for (const [key, param] of COLOR_KEYS) {
    // strip # to keep URL compact; parse.ts adds it back
    if (s[key] !== d[key]) params.set(param, (s[key] as string).replace("#", ""));
  }

  return `?${params.toString()}`;
}
