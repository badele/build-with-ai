export interface BadgeStyle {
  // Total size (always explicit — set from natural size on first load)
  width: number;
  height: number;
  // Separators
  leftZoneWidth: number;
  topRowHeight: number;
  // Left zone
  leftZoneScale: number;
  // Font sizes
  titleFontSize: number;
  fieldFontSize: number;
  // Text alignment in the right zone
  titleAlign: "left" | "center" | "right";
  fieldAlign: "left" | "center" | "right";
  // Colors — left zone gradient
  leftGradStart: string;
  leftGradEnd: string;
  // Colors — title text gradient
  titleGradStart: string;
  titleGradEnd: string;
  // Colors — badge background
  bg: string;
  // Optional custom SVG for the left zone
  customSvg?: string;
}

export interface BadgeField {
  key: string;
  value: string;
  keyColor?: string;
  valueColor?: string;
}

export interface BadgeConfig {
  text: string;
  fields: BadgeField[];
  style: BadgeStyle;
}

export interface LayoutMetrics {
  width: number;
  height: number;
  leftZoneWidth: number;
  topRowHeight: number;
  bottomRowHeight: number;
  fieldLines: BadgeField[][];
}
