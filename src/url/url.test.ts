import { describe, it, expect } from "vitest";
import { parseUrl } from "./parse";
import { serializeUrl } from "./serialize";
import { DEFAULT_STYLE } from "../badge/theme";

describe("parseUrl", () => {
  it("returns defaults when no params", () => {
    const config = parseUrl("");
    expect(config.text).toBe("BUILT WITH AI");
    expect(config.fields.length).toBeGreaterThan(0);
    expect(config.style).toEqual(DEFAULT_STYLE);
  });

  it("parses text param", () => {
    expect(parseUrl("?text=VIBE+CODED").text).toBe("VIBE CODED");
  });

  it("parses repeated f params", () => {
    const config = parseUrl("?text=TEST&f=SPEC:HUMAN%2BAI&f=CODE:AI");
    expect(config.fields).toEqual([
      { key: "SPEC", value: "HUMAN+AI" },
      { key: "CODE", value: "AI" },
    ]);
  });

  it("parses per-field key and value colors", () => {
    const config = parseUrl("?text=X&f=CODE:AI|ff0000|00ff00");
    expect(config.fields[0].keyColor).toBe("#ff0000");
    expect(config.fields[0].valueColor).toBe("#00ff00");
  });

  it("parses only key color (empty value color)", () => {
    const config = parseUrl("?text=X&f=CODE:AI|ff0000|");
    expect(config.fields[0].keyColor).toBe("#ff0000");
    expect(config.fields[0].valueColor).toBeUndefined();
  });

  it("leaves colors undefined when not set", () => {
    const config = parseUrl("?text=X&f=CODE:AI");
    expect(config.fields[0].keyColor).toBeUndefined();
    expect(config.fields[0].valueColor).toBeUndefined();
  });
});

describe("serializeUrl", () => {
  it("round-trips text, fields and style", () => {
    const original = {
      text: "AI ASSISTED",
      fields: [{ key: "SPEC", value: "HUMAN+AI" }, { key: "CODE", value: "AI" }],
      style: { ...DEFAULT_STYLE },
    };
    const parsed = parseUrl(serializeUrl(original));
    expect(parsed.text).toBe(original.text);
    expect(parsed.fields).toEqual(original.fields);
    expect(parsed.style).toEqual(original.style);
  });

  it("omits non-dimension style params when using defaults", () => {
    const config = { text: "TEST", fields: [], style: { ...DEFAULT_STYLE } };
    const url = serializeUrl(config);
    // sz_w and sz_h are always serialized; other sz_* and c_* are omitted when default
    expect(url).not.toMatch(/sz_r|sz_t|sz_f/);
    expect(url).not.toContain("c_");
  });

  it("round-trips per-field colors", () => {
    const config = {
      text: "TEST",
      fields: [{ key: "CODE", value: "AI", keyColor: "#ff0000", valueColor: "#00ff00" }],
      style: { ...DEFAULT_STYLE },
    };
    const parsed = parseUrl(serializeUrl(config));
    expect(parsed.fields[0].keyColor).toBe("#ff0000");
    expect(parsed.fields[0].valueColor).toBe("#00ff00");
  });

  it("omits | when no field colors", () => {
    const config = {
      text: "TEST",
      fields: [{ key: "CODE", value: "AI" }],
      style: { ...DEFAULT_STYLE },
    };
    expect(serializeUrl(config)).not.toContain("|");
  });
});
