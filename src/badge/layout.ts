import { BadgeConfig, BadgeField, BadgeStyle, LayoutMetrics } from "./types";
import { SIZES } from "./theme";

function measureTitleWidth(text: string, style: BadgeStyle): number {
  return (
    text.length *
    SIZES.charWidthTitle *
    (style.titleFontSize / SIZES.titleFontSize)
  );
}

function measureFieldLineWidth(
  fields: BadgeField[],
  style: BadgeStyle,
): number {
  const scale = style.fieldFontSize / SIZES.fieldFontSize;
  const charW = SIZES.charWidthField * scale;
  const sepW = 3 * charW + 4;
  let w = 0;
  for (let i = 0; i < fields.length; i++) {
    const { key, value } = fields[i];
    w += (key.length + 1 + value.length) * charW;
    if (i < fields.length - 1) w += sepW;
  }
  return w;
}

function computeFieldLines(
  fields: BadgeField[],
  style: Pick<BadgeStyle, "leftZoneWidth" | "fieldFontSize">,
): BadgeField[][] {
  const lz = style.leftZoneWidth;
  const maxTextZoneW = SIZES.maxBadgeWidth - lz - 2 * SIZES.padH;
  const fieldLines: BadgeField[][] = [];
  if (fields.length > 0) {
    let currentLine: BadgeField[] = [];
    for (const field of fields) {
      const testLine = [...currentLine, field];
      if (
        currentLine.length > 0 &&
        measureFieldLineWidth(testLine, style as BadgeStyle) > maxTextZoneW
      ) {
        fieldLines.push(currentLine);
        currentLine = [field];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) fieldLines.push(currentLine);
  }
  return fieldLines;
}

export function computeNaturalDimensions(config: BadgeConfig): {
  width: number;
  height: number;
} {
  const { text, fields, style } = config;
  const lz = style.leftZoneWidth;

  const fieldLines = computeFieldLines(fields, style);
  const titleTextW = measureTitleWidth(text, style);
  const maxFieldTextW =
    fieldLines.length > 0
      ? Math.max(...fieldLines.map((l) => measureFieldLineWidth(l, style)))
      : 0;
  const textZoneW = Math.max(titleTextW, maxFieldTextW);

  const width = Math.round(
    Math.min(
      SIZES.maxBadgeWidth,
      Math.max(lz + 2 * SIZES.padH + textZoneW, SIZES.minBadgeWidth),
    ),
  );

  const topRowHeight = style.topRowHeight;
  const bottomHeight =
    fields.length > 0
      ? SIZES.bottomLineHeight * fieldLines.length + SIZES.bottomPad
      : 0;
  const height = topRowHeight + bottomHeight;

  return { width, height };
}

export function computeLayout(config: BadgeConfig): LayoutMetrics {
  const { fields, style } = config;

  const fieldLines = computeFieldLines(fields, style);
  const topRowHeight = style.topRowHeight;

  return {
    width: style.width,
    height: style.height,
    leftZoneWidth: style.leftZoneWidth,
    topRowHeight,
    bottomRowHeight: SIZES.bottomLineHeight,
    fieldLines,
  };
}
