import { describe, it, expect } from "vitest";
import { generateBadge } from "./generate";
import { computeLayout, computeNaturalDimensions } from "./layout";
import { DEFAULT_STYLE } from "./theme";
import { BadgeConfig } from "./types";

function cfg(text: string, fields: Array<[string, string]> = []): BadgeConfig {
  return {
    text,
    fields: fields.map(([key, value]) => ({ key, value })),
    style: { ...DEFAULT_STYLE },
  };
}

describe("generateBadge", () => {
  it("returns valid SVG", () => {
    const svg = generateBadge(cfg("BUILT WITH AI"));
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("includes the main text", () => {
    expect(generateBadge(cfg("VIBE CODED"))).toContain("VIBE CODED");
  });

  it("includes field keys and values", () => {
    const svg = generateBadge(cfg("BUILT WITH AI", [["SPEC", "HUMAN+AI"], ["CODE", "AI"]]));
    expect(svg).toContain("SPEC");
    expect(svg).toContain("HUMAN+AI");
    expect(svg).toContain("CODE");
  });

  it("escapes XML special characters", () => {
    const svg = generateBadge(cfg("A & B", [["<KEY>", "VAL>UE"]]));
    expect(svg).toContain("A &amp; B");
    expect(svg).toContain("&lt;KEY&gt;");
    expect(svg).toContain("VAL&gt;UE");
  });

  it("has no fields section when fields is empty", () => {
    const config = cfg("BUILT WITH AI");
    const layout = computeLayout(config);
    expect(layout.fieldLines).toHaveLength(0);
    const { height } = computeNaturalDimensions(config);
    expect(height).toBe(layout.topRowHeight);
  });

  it("uses per-field keyColor and valueColor independently", () => {
    const config: BadgeConfig = {
      text: "TEST",
      fields: [{ key: "CODE", value: "AI", keyColor: "#ff0000", valueColor: "#00ff00" }],
      style: { ...DEFAULT_STYLE },
    };
    const svg = generateBadge(config);
    expect(svg).toContain("#ff0000");
    expect(svg).toContain("#00ff00");
  });

  it("reflects style overrides in SVG", () => {
    const config = cfg("TEST");
    config.style.bg = "#ff0000";
    config.style.titleFontSize = 30;
    const svg = generateBadge(config);
    expect(svg).toContain("#ff0000");
    expect(svg).toContain('font-size="30"');
  });
});

describe("computeLayout", () => {
  it("wraps fields to multiple lines when too wide", () => {
    const config = cfg("BUILT WITH AI", [
      ["VERY LONG KEY ONE", "VERY LONG VALUE ONE"],
      ["VERY LONG KEY TWO", "VERY LONG VALUE TWO"],
      ["VERY LONG KEY THREE", "VERY LONG VALUE THREE"],
      ["VERY LONG KEY FOUR", "VERY LONG VALUE FOUR"],
      ["VERY LONG KEY FIVE", "VERY LONG VALUE FIVE"],
    ]);
    expect(computeLayout(config).fieldLines.length).toBeGreaterThan(1);
  });

  it("badge width respects min/max bounds", () => {
    expect(computeLayout(cfg("X")).width).toBeGreaterThanOrEqual(260);
    expect(computeLayout(cfg("A".repeat(100), [["K".repeat(50), "V".repeat(50)]])).width).toBeLessThanOrEqual(620);
  });

  it("topRowHeight reflects style override", () => {
    const config = cfg("TEST");
    config.style.topRowHeight = 64;
    expect(computeLayout(config).topRowHeight).toBe(64);
  });
});

