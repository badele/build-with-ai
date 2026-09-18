import { BadgeConfig, LayoutMetrics } from "./types";
import { SIZES } from "./theme";

export function computeNaturalDimensions(config: BadgeConfig): {
  width: number;
  height: number;
} {
  const { text, fields, style } = config;
  const lz = style.leftZoneWidth;
  const scale = style.fieldFontSize / SIZES.fieldFontSize;
  const charW = SIZES.charWidthField * scale;
  const sepW = 3 * charW + 4;

  let fieldTextW = 0;
  for (let i = 0; i < fields.length; i++) {
    fieldTextW += (fields[i].key.length + 1 + fields[i].value.length) * charW;
    if (i < fields.length - 1) fieldTextW += sepW;
  }

  const titleTextW =
    text.length * SIZES.charWidthTitle * (style.titleFontSize / SIZES.titleFontSize);
  const textZoneW = Math.max(titleTextW, fieldTextW);

  const width = Math.round(
    Math.min(
      SIZES.maxBadgeWidth,
      Math.max(lz + 2 * SIZES.padH + textZoneW, SIZES.minBadgeWidth),
    ),
  );

  const bottomHeight =
    fields.length > 0 ? SIZES.bottomLineHeight + SIZES.bottomPad : 0;

  return { width, height: style.topRowHeight + bottomHeight };
}

export function computeLayout(config: BadgeConfig): LayoutMetrics {
  const { fields, style } = config;

  return {
    width: style.width,
    height: style.height,
    leftZoneWidth: style.leftZoneWidth,
    topRowHeight: style.topRowHeight,
    bottomRowHeight: SIZES.bottomLineHeight,
    fieldLines: fields.length > 0 ? [fields] : [],
  };
}
