export const COLORS = {
  bg: "#15171b",
  leftGradStart: "#6d20ff",
  leftGradMid: "#3567f5",
  leftGradEnd: "#18c9ef",
  textGradStart: "#1ed6eb",
  textGradMid: "#4287f5",
  textGradEnd: "#9b4df4",
  separatorBar: "#737985",
  separatorLine: "#2a2d35",
  borderStroke: "#24272d",
  titleText: "#ffffff",
  keyText: "#a5aab5",
  valueText: "#e0e4ef",
  dotText: "#737985",
} as const;

import { BadgeStyle } from "./types";

export const DEFAULT_STYLE: BadgeStyle = {
  // Natural size for the default config text + fields
  width: 485,
  height: 86,
  leftZoneWidth: 100,
  topRowHeight: 48,
  leftZoneScale: 1,
  titleFontSize: 20,
  fieldFontSize: 13,
  titleAlign: "center" as const,
  fieldAlign: "center" as const,
  leftGradStart: COLORS.leftGradStart,
  leftGradEnd: COLORS.leftGradEnd,
  titleGradStart: COLORS.textGradStart,
  titleGradEnd: COLORS.textGradEnd,
  bg: COLORS.bg,
};

export const FONT_FAMILY =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

export const SIZES = {
  bottomLineHeight: 28,
  bottomPad: 10,
  padH: 16,
  titleFontSize: 20,
  fieldFontSize: 13,
  charWidthTitle: 11,
  charWidthField: 7.5,
  maxBadgeWidth: 620,
  minBadgeWidth: 260,
  borderRadius: 12,
} as const;
